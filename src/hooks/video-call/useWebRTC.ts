"use client";

import { useEffect, useRef, useState } from "react";

interface PeerConnection {
  pc: RTCPeerConnection;
  stream?: MediaStream;
}

export function useWebRTC({
  stompClient,
  roomId,
  name,
  connected,
}: {
  stompClient: any;
  roomId: string;
  name: string;
  connected: boolean;
}) {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map());

  const peersRef = useRef<Map<string, PeerConnection>>(new Map());
  const pendingCandidates = useRef<Map<string, RTCIceCandidateInit[]>>(
    new Map()
  );
  const joinedRef = useRef(false);

  const configuration: RTCConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  /* ------------------ LOCAL MEDIA ------------------ */
  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        stream.getAudioTracks().forEach((t) => (t.enabled = false));
        stream.getVideoTracks().forEach((t) => (t.enabled = false));
        setMicOn(false);
        setCameraOn(false);

        console.log("✅ Local stream initialized");
        setLocalStream(stream);
      } catch (error) {
        console.error("❌ Error getting media:", error);
      }
    };
    init();

    return () => {
      localStream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  /* ------------------ PEER ------------------ */
  const createPeer = (peerId: string) => {
    console.log("🔧 Creating peer for:", peerId);

    if (!localStream) {
      console.error("❌ Local stream not ready");
      throw new Error("Local stream not ready");
    }

    const pc = new RTCPeerConnection(configuration);

    // Add local tracks
    localStream.getTracks().forEach((t) => {
      console.log("➕ Adding track:", t.kind, "to", peerId);
      pc.addTrack(t, localStream);
    });

    // ICE candidate
    pc.onicecandidate = (e) => {
      if (e.candidate && stompClient.current?.connected) {
        console.log("📤 Sending ICE candidate to:", peerId);
        stompClient.current.publish({
          destination: `/app/room/${roomId}/signal`,
          body: JSON.stringify({
            type: "candidate",
            sender: name,
            payload: { target: peerId, candidate: e.candidate },
          }),
        });
      }
    };

    // Receive remote track
    pc.ontrack = (e) => {
      console.log("📹 Received track from", peerId, "- type:", e.track.kind);
      const remoteStream = e.streams[0];

      peersRef.current.set(peerId, {
        pc,
        stream: remoteStream,
      });
      setPeers(new Map(peersRef.current));
      console.log("✅ Remote stream set for:", peerId);
    };

    // Connection state
    pc.onconnectionstatechange = () => {
      console.log(`🔗 [${peerId}] Connection state:`, pc.connectionState);
      if (
        pc.connectionState === "failed" ||
        pc.connectionState === "disconnected" ||
        pc.connectionState === "closed"
      ) {
        console.log("⚠️ Removing peer:", peerId);
        removePeer(peerId);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`🧊 [${peerId}] ICE state:`, pc.iceConnectionState);
    };

    return pc;
  };

  const removePeer = (peerId: string) => {
    console.log("🗑️ Removing peer:", peerId);
    const peer = peersRef.current.get(peerId);
    peer?.stream?.getTracks().forEach((t) => t.stop());
    peer?.pc.close();

    peersRef.current.delete(peerId);
    pendingCandidates.current.delete(peerId);
    setPeers(new Map(peersRef.current));
  };

  /* ------------------ SIGNALING ------------------ */
  const handleSignal = async (data: any) => {
    const { type, sender, payload } = data;
    console.log("📨 Handling signal:", type, "from:", sender);

    try {
      if (type === "offer" && payload.target === name) {
        //xử lý nếu có offer tới mình (người kia gọi mình)
        console.log("📥 Processing offer from:", sender);

        // 1.Remove existing peer if any (người đó từng gọi b nhưng b ko nhấc máy, giờ gọi lại thì đóng kết nối cũ đi )
        if (peersRef.current.has(sender)) {
          console.log("🔄 Closing existing connection with:", sender);
          removePeer(sender);
        }
        //2.tạo kết nối mới
        const pc = createPeer(sender);
        peersRef.current.set(sender, { pc });
        setPeers(new Map(peersRef.current));
        //Nghe người kia nói =>"OK, tôi nghe anh nói rồi, anh dùng camera + mic như thế này"
        await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
        console.log("✅ Remote description set");

        // 3.Process pending candidates , xu ly ICE candidate nhận được trước khi có remote description
        const pending = pendingCandidates.current.get(sender) || [];
        if (pending.length > 0) {
          console.log(`📦 Adding ${pending.length} pending candidates`);
          for (const candidate of pending) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
          pendingCandidates.current.delete(sender);
        }
        //4.Trả lời lại người offer
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        console.log("📤 Sending answer to:", sender);
        stompClient.current.publish({
          destination: `/app/room/${roomId}/signal`,
          body: JSON.stringify({
            type: "answer",
            sender: name,
            payload: { target: sender, answer },
          }),
        });
      }
      //2.Trường hợp mình là người offer, người kia trl lại
      if (type === "answer" && payload.target === name) {
        console.log("📥 Processing answer from:", sender);
        const peer = peersRef.current.get(sender);
        //2.1 nếu người tôi gọi đã tạo peer connection rồi và trạng thái signaling
        //  ko phải stable (đang chờ trl lời) => thì set remote description-> 2 ben noi chuyen duoc
        if (peer && peer.pc.signalingState !== "stable") {
          await peer.pc.setRemoteDescription(
            new RTCSessionDescription(payload.answer)
          );
          console.log("✅ Remote description set from answer");

          // Process pending candidates
          const pending = pendingCandidates.current.get(sender) || [];
          if (pending.length > 0) {
            console.log(`📦 Adding ${pending.length} pending candidates`);
            for (const candidate of pending) {
              await peer.pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
            pendingCandidates.current.delete(sender);
          }
        }
      }
      //th3: xử lý ice candidate nhận được từ người khác (địa chỉ mạng)
      if (type === "candidate" && payload.target === name) {
        console.log("📥 Processing ICE candidate from:", sender);
        const peer = peersRef.current.get(sender);
        //3.1 nếu đã có remoteDescription thì thêm thẳng vào peer connection (đã biết đươngf đi)
        if (peer?.pc.remoteDescription) {
          await peer.pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
          console.log("✅ ICE candidate added");
        } else {
          //3.2 nếu chưa có remoteDescription thì lưu tạm vào pending list (chưa biết đường đi)
          console.log("⏳ Queuing candidate (no remote description yet)");
          const list = pendingCandidates.current.get(sender) || [];
          list.push(payload.candidate);
          pendingCandidates.current.set(sender, list);
        }
      }
    } catch (error) {
      console.error("❌ Error handling signal:", error);
    }
  };

  /* ------------------ JOIN ROOM ------------------ */
  useEffect(() => {
    if (!connected || !localStream || joinedRef.current) return;

    console.log("🚀 Joining room:", roomId, "as:", name);
    const client = stompClient.current;

    let signalSub: any = null;
    let systemSub: any = null;

    // Small delay to ensure connection is ready
    const setupTimeout = setTimeout(() => {
      console.log("📡 Setting up subscriptions...");

      signalSub = client.subscribe(`/topic/room/${roomId}/signal`, (m: any) => {
        const data = JSON.parse(m.body);
        if (data.sender !== name) {
          handleSignal(data);
        }
      });

      systemSub = client.subscribe(`/topic/room/${roomId}/system`, (m: any) => {
        console.log("📢 System:", m.body);
        if (m.body.includes("joined") && !m.body.includes(name)) {
          const peerId = m.body.split(" ")[0];
          console.log("👤 New user joined:", peerId);
          setTimeout(() => {
            createOffer(peerId);
          }, 1000);
        }
      });

      console.log("📤 Sending join message...");
      client.publish({
        destination: `/app/room/${roomId}/join`,
        body: JSON.stringify({
          type: "join",
          sender: name,
          roomId: roomId,
        }),
      });

      joinedRef.current = true;
      console.log("✅ Join complete");
    }, 200);

    return () => {
      clearTimeout(setupTimeout);
      console.log("🧹 Cleaning up room...");

      if (client.connected && joinedRef.current) {
        client.publish({
          destination: `/app/room/${roomId}/leave`,
          body: JSON.stringify({
            type: "leave",
            sender: name,
            roomId: roomId,
          }),
        });
      }

      signalSub?.unsubscribe();
      systemSub?.unsubscribe();
      peersRef.current.forEach((_, id) => removePeer(id));
      joinedRef.current = false;
    };
  }, [connected, localStream, roomId, name]);

  const createOffer = async (peerId: string) => {
    try {
      console.log("🎯 Creating offer for:", peerId);

      // Don't create if already connected
      const existing = peersRef.current.get(peerId);
      if (existing && existing.pc.connectionState === "connected") {
        console.log("⏭️ Already connected to:", peerId);
        return;
      }

      // Close existing if any
      if (existing) {
        console.log("🔄 Closing old connection");
        removePeer(peerId);
      }

      const pc = createPeer(peerId);
      peersRef.current.set(peerId, { pc });
      setPeers(new Map(peersRef.current));

      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(offer);

      console.log("📤 Sending offer to:", peerId);
      stompClient.current.publish({
        destination: `/app/room/${roomId}/signal`,
        body: JSON.stringify({
          type: "offer",
          sender: name,
          payload: { target: peerId, offer },
        }),
      });
    } catch (error) {
      console.error("❌ Error creating offer:", error);
    }
  };

  /* ------------------ CONTROLS ------------------ */
  const muteMic = () => {
    localStream?.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
      setMicOn(t.enabled);
    });
  };

  const toggleCamera = () => {
    localStream?.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
      setCameraOn(t.enabled);
    });
  };

  const shareScreen = async () => {
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const track = screen.getVideoTracks()[0];
      peersRef.current.forEach(({ pc }, peerId) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) {
          sender.replaceTrack(track);
          console.log("🖥 Screen sharing with:", peerId);
        }
      });

      track.onended = () => {
        const camTrack = localStream?.getVideoTracks()[0];
        peersRef.current.forEach(({ pc }, peerId) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender && camTrack) {
            sender.replaceTrack(camTrack);
            console.log("📷 Back to camera for:", peerId);
          }
        });
      };
    } catch (error) {
      console.error("❌ Error sharing screen:", error);
    }
  };
  const turnOffCameraHard = () => {
    localStream?.getVideoTracks().forEach((t) => t.stop());
    setCameraOn(false);
  };

  const turnOnCameraHard = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const newTrack = stream.getVideoTracks()[0];

    // replace cho peer
    peersRef.current.forEach(({ pc }) => {
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      sender?.replaceTrack(newTrack);
    });

    // update local stream
    const newStream = new MediaStream([
      ...localStream!.getAudioTracks(),
      newTrack,
    ]);
    setLocalStream(newStream);
    setCameraOn(true);
  };

  return {
    localStream,
    peers,
    micOn,
    cameraOn,
    muteMic,
    toggleCamera,
    shareScreen,
    turnOffCameraHard,
    turnOnCameraHard,
  };
}

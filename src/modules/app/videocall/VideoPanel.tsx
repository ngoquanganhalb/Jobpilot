"use client";

import { useEffect, useRef, useState } from "react";

interface VideoPanelProps {
  stompClient: any;
  roomId: string;
  name: string;
  connected: boolean;
}

interface PeerConnection {
  pc: RTCPeerConnection;
  stream?: MediaStream;
}

export default function VideoPanel({
  stompClient,
  roomId,
  name,
  connected,
}: VideoPanelProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map());
  const peersRef = useRef<Map<string, PeerConnection>>(new Map());
  const pendingCandidates = useRef<Map<string, RTCIceCandidateInit[]>>(
    new Map()
  );
  const hasJoinedRef = useRef(false);

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  // Initialize local stream
  useEffect(() => {
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        console.log("✅ Local stream initialized");
      } catch (error) {
        console.error("❌ Error accessing media devices:", error);
      }
    };

    initLocalStream();

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Create peer connection
  const createPeerConnection = (peerId: string): RTCPeerConnection => {
    console.log("🔧 Creating peer connection for:", peerId);
    const pc = new RTCPeerConnection(configuration);

    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
      console.log("✅ Added local tracks to peer:", peerId);
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && stompClient.current?.connected) {
        console.log("📤 Sending ICE candidate to:", peerId);
        stompClient.current.publish({
          destination: `/app/room/${roomId}/signal`,
          body: JSON.stringify({
            type: "candidate",
            sender: name,
            payload: {
              target: peerId,
              candidate: event.candidate,
            },
          }),
        });
      }
    };

    // Handle connection state
    pc.onconnectionstatechange = () => {
      console.log(`🔗 [${peerId}] Connection state:`, pc.connectionState);
      if (
        pc.connectionState === "failed" ||
        pc.connectionState === "disconnected" ||
        pc.connectionState === "closed"
      ) {
        removePeer(peerId);
        console.log("⚠️ Connection issue with:", peerId);
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (
        pc.iceConnectionState === "disconnected" ||
        pc.iceConnectionState === "closed" ||
        pc.iceConnectionState === "failed"
      ) {
        removePeer(peerId);
      }
      console.log(`🧊 [${peerId}] ICE state:`, pc.iceConnectionState);
    };

    // Handle incoming stream
    pc.ontrack = (event) => {
      console.log(
        "📹 Received track from",
        peerId,
        "- type:",
        event.track.kind
      );
      const remoteStream = event.streams[0];

      peersRef.current.set(peerId, {
        pc,
        stream: remoteStream,
      });
      setPeers(new Map(peersRef.current));
      console.log("✅ Remote stream set for:", peerId);
    };

    return pc;
  };

  // Join room and setup signaling
  useEffect(() => {
    if (!connected || !localStream || hasJoinedRef.current) return;

    const client = stompClient.current;
    console.log("🚀 Setting up room:", roomId, "as:", name);

    let signalSub: any = null;
    let systemSub: any = null;

    // Small delay to ensure connection is fully established
    const setupTimeout = setTimeout(() => {
      console.log("📡 Subscribing to topics...");

      // Subscribe to signaling messages
      signalSub = client.subscribe(
        `/topic/room/${roomId}/signal`,
        (message: any) => {
          try {
            const data = JSON.parse(message.body);
            if (data.sender !== name) {
              console.log("📨 Received:", data.type, "from:", data.sender);
              handleSignal(data);
            }
          } catch (error) {
            console.error("❌ Error parsing signal message:", error);
          }
        }
      );

      // Subscribe to system messages
      systemSub = client.subscribe(
        `/topic/room/${roomId}/system`,
        (message: any) => {
          const msg = message.body;
          console.log("📢 System:", msg);

          // Only the FIRST user sends offer when someone joins
          if (msg.includes("joined") && !msg.includes(name)) {
            const joinedUser = msg.split(" ")[0];
            console.log(
              "👤 New user joined:",
              joinedUser,
              "- Initiating connection..."
            );
            // Small delay to ensure both sides are ready
            setTimeout(() => {
              createOffer(joinedUser);
            }, 1000);
          }
        }
      );

      console.log("✅ Subscriptions ready");

      // Join the room after subscriptions are set up
      console.log("📤 Sending join message...");
      client.publish({
        destination: `/app/room/${roomId}/join`,
        body: JSON.stringify({
          type: "join",
          sender: name,
          roomId: roomId,
        }),
      });

      hasJoinedRef.current = true;
      console.log("✅ Join complete");
    }, 200);

    return () => {
      clearTimeout(setupTimeout);
      console.log("🧹 Cleaning up...");

      // Send leave message
      if (client.connected && hasJoinedRef.current) {
        try {
          client.publish({
            destination: `/app/room/${roomId}/leave`,
            body: JSON.stringify({
              type: "leave",
              sender: name,
              roomId: roomId,
            }),
          });
        } catch (error) {
          console.error("❌ Error sending leave:", error);
        }
      }

      signalSub?.unsubscribe();
      systemSub?.unsubscribe();

      // Close all peer connections
      // peersRef.current.forEach((peer, peerId) => {
      //   console.log("🔌 Closing peer connection:", peerId);
      //   peer.pc.close();
      // });
      peersRef.current.forEach((_, peerId) => {
        removePeer(peerId);
      });

      peersRef.current.clear();
      pendingCandidates.current.clear();

      hasJoinedRef.current = false;
    };
  }, [connected, localStream, roomId, name]);

  // Handle signaling messages
  const handleSignal = async (data: any) => {
    const { type, sender, payload } = data;

    switch (type) {
      case "offer":
        // Only handle if it's meant for us (no target means broadcast)
        if (!payload.target || payload.target === name) {
          console.log("📥 Handling offer from:", sender);
          await handleOffer(sender, payload.offer);
        }
        break;
      case "answer":
        if (payload.target === name) {
          console.log("📥 Handling answer from:", sender);
          await handleAnswer(sender, payload.answer);
        }
        break;
      case "candidate":
        if (payload.target === name) {
          console.log("📥 Handling ICE candidate from:", sender);
          await handleCandidate(sender, payload.candidate);
        }
        break;
    }
  };

  // Create and send offer
  const createOffer = async (peerId: string) => {
    try {
      // Don't create if already exists and connected
      const existing = peersRef.current.get(peerId);
      if (existing && existing.pc.connectionState === "connected") {
        console.log("⏭️ Already connected to:", peerId);
        return;
      }

      // Close existing connection if any
      if (existing) {
        console.log("🔄 Closing old connection with:", peerId);
        existing.pc.close();
      }

      console.log("🎯 Creating offer for:", peerId);
      const pc = createPeerConnection(peerId);
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
          payload: {
            target: peerId,
            offer: offer,
          },
        }),
      });
    } catch (error) {
      console.error("❌ Error creating offer:", error);
    }
  };

  // Handle incoming offer
  const handleOffer = async (
    peerId: string,
    offer: RTCSessionDescriptionInit
  ) => {
    try {
      console.log("🎯 Processing offer from:", peerId);

      // Close existing connection if any
      const existingPeer = peersRef.current.get(peerId);
      if (existingPeer) {
        console.log("🔄 Closing existing connection with:", peerId);
        existingPeer.pc.close();
      }

      const pc = createPeerConnection(peerId);
      peersRef.current.set(peerId, { pc });
      setPeers(new Map(peersRef.current));

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      console.log("✅ Remote description set for:", peerId);

      // Process pending candidates
      const pending = pendingCandidates.current.get(peerId) || [];
      if (pending.length > 0) {
        console.log(
          `📦 Adding ${pending.length} pending candidates for:`,
          peerId
        );
        for (const candidate of pending) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingCandidates.current.delete(peerId);
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      console.log("📤 Sending answer to:", peerId);
      stompClient.current.publish({
        destination: `/app/room/${roomId}/signal`,
        body: JSON.stringify({
          type: "answer",
          sender: name,
          payload: {
            target: peerId,
            answer: answer,
          },
        }),
      });
    } catch (error) {
      console.error("❌ Error handling offer:", error);
    }
  };

  // Handle incoming answer
  const handleAnswer = async (
    peerId: string,
    answer: RTCSessionDescriptionInit
  ) => {
    try {
      const peerConn = peersRef.current.get(peerId);
      if (!peerConn) {
        console.warn("⚠️ No peer connection found for:", peerId);
        return;
      }

      if (peerConn.pc.signalingState === "stable") {
        console.log("⏭️ Already stable with:", peerId);
        return;
      }

      await peerConn.pc.setRemoteDescription(new RTCSessionDescription(answer));
      console.log("✅ Remote description set from answer:", peerId);

      // Process pending candidates
      const pending = pendingCandidates.current.get(peerId) || [];
      if (pending.length > 0) {
        console.log(
          `📦 Adding ${pending.length} pending candidates for:`,
          peerId
        );
        for (const candidate of pending) {
          await peerConn.pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingCandidates.current.delete(peerId);
      }
    } catch (error) {
      console.error("❌ Error handling answer:", error);
    }
  };

  // Handle ICE candidate
  const handleCandidate = async (
    peerId: string,
    candidate: RTCIceCandidateInit
  ) => {
    try {
      const peerConn = peersRef.current.get(peerId);

      if (!peerConn) {
        console.log("⏳ Peer not ready, queuing candidate from:", peerId);
        const pending = pendingCandidates.current.get(peerId) || [];
        pending.push(candidate);
        pendingCandidates.current.set(peerId, pending);
        return;
      }

      if (!peerConn.pc.remoteDescription) {
        console.log(
          "⏳ Remote description not set, queuing candidate from:",
          peerId
        );
        const pending = pendingCandidates.current.get(peerId) || [];
        pending.push(candidate);
        pendingCandidates.current.set(peerId, pending);
        return;
      }

      await peerConn.pc.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("✅ ICE candidate added from:", peerId);
    } catch (error) {
      console.error("❌ Error handling candidate:", error);
    }
  };

  const removePeer = (peerId: string) => {
    console.log("🧹 Removing peer:", peerId);

    const peer = peersRef.current.get(peerId);
    if (peer) {
      // stop remote stream
      peer.stream?.getTracks().forEach((t) => t.stop());

      // close pc
      peer.pc.ontrack = null;
      peer.pc.onicecandidate = null;
      peer.pc.close();
    }

    peersRef.current.delete(peerId);
    pendingCandidates.current.delete(peerId);

    // update UI
    setPeers(new Map(peersRef.current));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">Video Call</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Local video */}
        <div className="relative">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-64 bg-gray-900 rounded-lg object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
            {name} (You)
          </div>
        </div>

        {/* Remote videos */}
        {Array.from(peers.entries()).map(([peerId, peerConn]) => (
          <RemoteVideo key={peerId} peerId={peerId} peerConn={peerConn} />
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded text-sm space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">WebSocket:</span>
          <span className={connected ? "text-green-600" : "text-red-600"}>
            {connected ? "✅ Connected" : "❌ Disconnected"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Camera/Mic:</span>
          <span className={localStream ? "text-green-600" : "text-red-600"}>
            {localStream ? "✅ Active" : "❌ Inactive"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Remote Peers:</span>
          <span className="font-mono">{peers.size}</span>
        </div>
        {peers.size > 0 && (
          <div className="mt-2 pl-4 space-y-1 border-l-2 border-gray-300">
            {Array.from(peers.entries()).map(([peerId, peer]) => (
              <div key={peerId} className="text-xs font-mono">
                <span className="font-semibold">{peerId}:</span>{" "}
                <span
                  className={
                    peer.pc.connectionState === "connected"
                      ? "text-green-600"
                      : peer.pc.connectionState === "connecting"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }
                >
                  {peer.pc.connectionState}
                </span>
                {" / "}
                <span
                  className={peer.stream ? "text-green-600" : "text-gray-400"}
                >
                  {peer.stream ? "stream ✅" : "no stream"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RemoteVideo({
  peerId,
  peerConn,
}: {
  peerId: string;
  peerConn: PeerConnection;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && peerConn.stream) {
      console.log("🎥 Attaching stream to video element for:", peerId);
      videoRef.current.srcObject = peerConn.stream;
    }
  }, [peerConn.stream, peerId]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-64 bg-gray-900 rounded-lg object-cover"
      />
      <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
        {peerId}
      </div>
      {!peerConn.stream && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-800 bg-opacity-75">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-2"></div>
          <div className="text-sm">Connecting to {peerId}...</div>
          <div className="text-xs text-gray-300 mt-1">
            {peerConn.pc.connectionState}
          </div>
        </div>
      )}
    </div>
  );
}

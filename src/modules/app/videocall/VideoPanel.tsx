"use client";

import { useWebRTC } from "@hooks/video-call/useWebRTC";
import { Mic, MicOff, ScreenShare, Video, VideoOff } from "lucide-react";
import { useRef, useEffect, useState } from "react";

export default function VideoPanel({
  stompClient,
  roomId,
  name,
  connected,
}: any) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localFocusedRef = useRef<HTMLVideoElement>(null);
  const localThumbnailRef = useRef<HTMLVideoElement>(null);
  const [focusedParticipant, setFocusedParticipant] = useState<string | null>(
    null
  );

  const {
    localStream,
    peers,
    micOn,
    cameraOn,
    muteMic,
    toggleCamera,
    shareScreen,
  } = useWebRTC({
    stompClient,
    roomId,
    name,
    connected,
  });

  // Attach local stream to grid view video
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      console.log("✅ Local video (grid) attached", localStream);
    }
  }, [localStream, focusedParticipant]);

  // Attach local stream to focused video
  useEffect(() => {
    if (
      localFocusedRef.current &&
      localStream &&
      focusedParticipant === "local"
    ) {
      localFocusedRef.current.srcObject = localStream;
      console.log("✅ Local video (focused) attached", localStream);
    }
  }, [localStream, focusedParticipant]);

  // Attach local stream to thumbnail
  useEffect(() => {
    if (
      localThumbnailRef.current &&
      localStream &&
      focusedParticipant &&
      focusedParticipant !== "local"
    ) {
      localThumbnailRef.current.srcObject = localStream;
      console.log("✅ Local video (thumbnail) attached", localStream);
    }
  }, [localStream, focusedParticipant]);

  // Calculate grid layout based on number of participants
  const totalParticipants = 1 + peers.size;

  const getGridClass = () => {
    if (totalParticipants === 1) return "grid-cols-1";
    if (totalParticipants === 2) return "grid-cols-2";
    if (totalParticipants <= 4) return "grid-cols-2";
    if (totalParticipants <= 6) return "grid-cols-3";
    if (totalParticipants <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  const getAspectRatio = () => {
    if (totalParticipants === 1) return "aspect-video";
    if (totalParticipants === 2) return "aspect-video";
    return "aspect-square";
  };

  const handleParticipantClick = (id: string) => {
    setFocusedParticipant(id === focusedParticipant ? null : id);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Video Grid */}
      <div className="flex-1 p-4 overflow-hidden relative">
        {focusedParticipant ? (
          // Focused view with thumbnails
          <div className="h-full flex flex-col gap-4">
            {/* Main focused video */}
            <div className="flex-1 min-h-0 flex items-center justify-center">
              {focusedParticipant === "local" ? (
                <div className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden">
                  <video
                    ref={localFocusedRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-contain"
                  />
                  {!cameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-6 left-6 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-lg font-medium flex items-center gap-2">
                    {name} (You)
                    {!micOn && <MicOff size={18} />}
                  </div>
                  <button
                    onClick={() => setFocusedParticipant(null)}
                    className="absolute top-4 right-4 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-lg transition"
                    title="Exit focused view"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                Array.from(peers.entries()).map(([peerId, peer]) =>
                  peerId === focusedParticipant ? (
                    <RemoteVideoFocused
                      key={peerId}
                      peerId={peerId}
                      peer={peer}
                      onClose={() => setFocusedParticipant(null)}
                    />
                  ) : null
                )
              )}
            </div>

            {/* Thumbnails strip */}
            <div className="flex-shrink-0 overflow-x-auto">
              <div className="flex gap-3 pb-2">
                {/* Local thumbnail - only show if not focused */}
                {focusedParticipant !== "local" && (
                  <div
                    onClick={() => handleParticipantClick("local")}
                    className="relative flex-shrink-0 w-40 h-28 bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
                  >
                    <video
                      ref={localThumbnailRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {!cameraOn && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                          {name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                      You {!micOn && <MicOff size={10} />}
                    </div>
                  </div>
                )}

                {/* Remote thumbnails - hide the focused one */}
                {Array.from(peers.entries()).map(([peerId, peer]) =>
                  peerId !== focusedParticipant ? (
                    <RemoteVideoThumbnail
                      key={peerId}
                      peerId={peerId}
                      peer={peer}
                      onClick={() => handleParticipantClick(peerId)}
                    />
                  ) : null
                )}
              </div>
            </div>
          </div>
        ) : (
          // Grid view (default)
          <div className={`grid ${getGridClass()} gap-4 h-full content-center`}>
            {/* Local Video */}
            <div
              onClick={() => handleParticipantClick("local")}
              className={`relative ${getAspectRatio()} bg-gray-800 rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-blue-500 transition`}
            >
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!cameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {name.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-2">
                {name} (You)
                {!micOn && <MicOff size={14} />}
              </div>
            </div>

            {/* Remote Videos */}
            {Array.from(peers.entries()).map(([peerId, peer]) => (
              <RemoteVideo
                key={peerId}
                peerId={peerId}
                peer={peer}
                aspectRatio={getAspectRatio()}
                onClick={() => handleParticipantClick(peerId)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={muteMic}
            className={`p-4 rounded-full transition ${
              micOn
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            title={micOn ? "Mute microphone" : "Unmute microphone"}
          >
            {micOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>

          <button
            onClick={toggleCamera}
            className={`p-4 rounded-full transition ${
              cameraOn
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            title={cameraOn ? "Turn off camera" : "Turn on camera"}
          >
            {cameraOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>

          <button
            onClick={shareScreen}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition"
            title="Share screen"
          >
            <ScreenShare size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Remote Video Components
function RemoteVideo({
  peerId,
  peer,
  aspectRatio,
  onClick,
}: {
  peerId: string;
  peer: any;
  aspectRatio: string;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && peer.stream) {
      videoRef.current.srcObject = peer.stream;
      console.log("✅ Remote video attached for:", peerId);
    }
  }, [peer.stream, peerId]);

  const isConnected = peer.pc.connectionState === "connected";

  return (
    <div
      onClick={onClick}
      className={`relative ${aspectRatio} bg-gray-800 rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-green-500 transition`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {!peer.stream && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
            {peerId.charAt(0).toUpperCase()}
          </div>
          {!isConnected && (
            <>
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-2"></div>
              <div className="text-gray-400 text-sm">Connecting...</div>
            </>
          )}
        </div>
      )}

      <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md text-sm font-medium">
        {peerId}
      </div>

      {!isConnected && (
        <div className="absolute top-3 right-3">
          <div className="animate-pulse bg-yellow-500 w-2 h-2 rounded-full"></div>
        </div>
      )}
    </div>
  );
}

function RemoteVideoFocused({
  peerId,
  peer,
  onClose,
}: {
  peerId: string;
  peer: any;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && peer.stream) {
      videoRef.current.srcObject = peer.stream;
    }
  }, [peer.stream, peerId]);

  const isConnected = peer.pc.connectionState === "connected";

  return (
    <div className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-contain"
      />

      {!peer.stream && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
          <div className="w-32 h-32 bg-green-600 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4">
            {peerId.charAt(0).toUpperCase()}
          </div>
          {!isConnected && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-3"></div>
              <div className="text-gray-300 text-lg">
                Connecting to {peerId}...
              </div>
            </>
          )}
        </div>
      )}

      <div className="absolute bottom-6 left-6 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-lg font-medium">
        {peerId}
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-lg transition"
        title="Exit focused view"
      >
        ✕
      </button>
    </div>
  );
}

function RemoteVideoThumbnail({
  peerId,
  peer,
  onClick,
}: {
  peerId: string;
  peer: any;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && peer.stream) {
      videoRef.current.srcObject = peer.stream;
    }
  }, [peer.stream, peerId]);

  return (
    <div
      onClick={onClick}
      className="relative flex-shrink-0 w-40 h-28 bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-green-500 transition"
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {!peer.stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
            {peerId.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white px-2 py-0.5 rounded text-xs font-medium">
        {peerId}
      </div>
    </div>
  );
}

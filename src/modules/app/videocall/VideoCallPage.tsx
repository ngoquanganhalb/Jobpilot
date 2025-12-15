"use client";

import { useEffect, useRef, useState } from "react";
import { createStompClient } from "@/lib/stomp";
import VideoPanel from "@modules/app/videocall/VideoPanel";
import ChatPanel from "@modules/app/videocall/ChatPanel";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

export default function VideoCallPage() {
  const authName = useSelector((state: RootState) => state.auth.user?.name);

  const [name, setName] = useState<string | null>(null);
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);

  const [connected, setConnected] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const stompClient = useRef<any>(null);

  useEffect(() => {
    setName(authName ?? "user-" + Math.floor(Math.random() * 1000));
  }, [authName]);

  useEffect(() => {
    if (!joined) return;

    stompClient.current = createStompClient(() => {
      setConnected(true);
    });

    stompClient.current.onDisconnect = () => {
      setConnected(false);
    };

    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [joined]);

  if (!name) return null;

  if (!joined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Join a Video Room
          </h1>
          <p className="text-sm text-gray-500 text-center mt-2">
            Enter a room ID to start or join a video call
          </p>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room ID
            </label>
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="e.g. jobpilot-team-01"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-3 text-xs text-gray-500">
            You will join as <span className="font-semibold">{name}</span>
          </div>

          <button
            disabled={!roomId}
            onClick={() => setJoined(true)}
            className="mt-6 w-full py-3 rounded-xl text-white font-semibold
                     bg-blue-600 hover:bg-blue-700
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition"
          >
            Join Room
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Share the room ID with others to join the same call
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-white font-semibold text-lg">{roomId}</h1>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-gray-300 text-sm">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">{name}</span>
          <button
            onClick={() => setShowChat(!showChat)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              showChat 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {showChat ? 'Hide Chat' : 'Show Chat'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className={`flex-1 transition-all duration-300 ${showChat ? 'pr-0' : ''}`}>
          <VideoPanel
            stompClient={stompClient}
            roomId={roomId}
            name={name}
            connected={connected}
          />
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-96 border-l border-gray-700 bg-gray-800 flex flex-col">
            <ChatPanel
              stompClient={stompClient}
              roomId={roomId}
              name={name}
              connected={connected}
              onHide={() => setShowChat(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}


{
  /* <div className="mt-4">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
          >
            {showDebug ? "🔽 Hide Debug" : "🔼 Show Debug"}
          </button>
        </div>

        {showDebug && (
          <DebugPanel
            stompClient={stompClient}
            roomId={roomId}
            name={name}
            connected={connected}
          />
        )} */
}

'use client';

import { useEffect, useState } from 'react';

interface DebugPanelProps {
  stompClient: any;
  roomId: string;
  name: string;
  connected: boolean;
}

export default function DebugPanel({ stompClient, roomId, name, connected }: DebugPanelProps) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!connected) return;

    const client = stompClient.current;

    const signalSub = client.subscribe(`/topic/room/${roomId}/signal`, (msg: any) => {
      setMessages(prev => [...prev.slice(-20), `[SIGNAL] ${msg.body}`]);
    });

    const systemSub = client.subscribe(`/topic/room/${roomId}/system`, (msg: any) => {
      setMessages(prev => [...prev.slice(-20), `[SYSTEM] ${msg.body}`]);
    });

    const chatSub = client.subscribe(`/topic/room/${roomId}/chat`, (msg: any) => {
      setMessages(prev => [...prev.slice(-20), `[CHAT] ${msg.body}`]);
    });

    return () => {
      signalSub?.unsubscribe();
      systemSub?.unsubscribe();
      chatSub?.unsubscribe();
    };
  }, [connected, roomId, stompClient]);

  const testJoin = () => {
    if (!connected) return;
    console.log(' Testing join...');
    stompClient.current.publish({
      destination: `/app/room/${roomId}/join`,
      body: JSON.stringify({
        type: 'join',
        sender: name + '-test',
        roomId: roomId,
      }),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Debug Panel</h2>
        <button
          onClick={testJoin}
          disabled={!connected}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 text-sm"
        >
          Test Join
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">WebSocket URL:</span>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            http://localhost:8080/ws
          </code>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">Connection:</span>
          <span className={connected ? 'text-green-600 font-semibold' : 'text-red-600'}>
            {connected ? ' Connected' : ' Disconnected'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">Room:</span>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{roomId}</code>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">Your Name:</span>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{name}</code>
        </div>
      </div>

      <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs h-64 overflow-y-auto">
        <div className="text-gray-500 mb-2"> Recent Messages (last 20)</div>
        {messages.length === 0 ? (
          <div className="text-gray-600">Waiting for messages...</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="mb-1">
              {msg}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
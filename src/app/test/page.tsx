'use client';

import { useEffect, useRef, useState } from 'react';
import { createStompClient } from '@/lib/stomp';
import VideoPanel from '@modules/app/videocall/VideoPanel';
import ChatPanel from '@modules/app/videocall/ChatPanel';
import HeaderVideo from '@modules/app/videocall/HeaderVideo';
import DebugPanel from '@modules/app/videocall/DebugPanel';

export default function VideoCallPage() {
  const roomId = 'room1';
  const [name, setName] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [showDebug, setShowDebug] = useState(true);
  const stompClient = useRef<any>(null);

  useEffect(() => {
    setName('user-' + Math.floor(Math.random() * 1000));
  }, []);

  useEffect(() => {
    console.log('🔌 Initializing STOMP client...');
    
    stompClient.current = createStompClient(() => {
      console.log('✅ STOMP client connected');
      setConnected(true);
    });

    stompClient.current.onDisconnect = () => {
      console.log('❌ STOMP client disconnected');
      setConnected(false);
    };

    stompClient.current.activate();

    return () => {
      console.log('🔌 Deactivating STOMP client');
      stompClient.current?.deactivate();
    };
  }, []);

  if (!name) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <HeaderVideo roomId={roomId} name={name} />

      <div className="mt-4">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
        >
          {showDebug ? '🔽 Hide Debug' : '🔼 Show Debug'}
        </button>
      </div>

      {showDebug && (
        <DebugPanel
          stompClient={stompClient}
          roomId={roomId}
          name={name}
          connected={connected}
        />
      )}

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2">
          <VideoPanel
            stompClient={stompClient}
            roomId={roomId}
            name={name}
            connected={connected}
          />
        </div>

        <ChatPanel
          stompClient={stompClient}
          roomId={roomId}
          name={name}
          connected={connected}
        />
      </div>
    </div>
  );
}
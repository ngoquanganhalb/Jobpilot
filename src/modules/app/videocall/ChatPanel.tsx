'use client';

import { useEffect, useRef, useState } from 'react';

interface ChatPanelProps {
  stompClient: any;
  roomId: string;
  name: string;
  connected: boolean;
}

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: Date;
}

export default function ChatPanel({ stompClient, roomId, name, connected }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!connected) return;

    const client = stompClient.current;

    // Subscribe to chat messages
    const chatSub = client.subscribe(`/topic/room/${roomId}/chat`, (message: any) => {
      const data = JSON.parse(message.body);
      setMessages((prev) => [
        ...prev,
        {
          sender: data.sender,
          message: data.payload.message,
          timestamp: new Date(),
        },
      ]);
    });

    // Subscribe to system messages
    const systemSub = client.subscribe(`/topic/room/${roomId}/system`, (message: any) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'System',
          message: message.body,
          timestamp: new Date(),
        },
      ]);
    });

    return () => {
      chatSub?.unsubscribe();
      systemSub?.unsubscribe();
    };
  }, [connected, roomId, stompClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !connected) return;

    stompClient.current.publish({
      destination: `/app/room/${roomId}/chat`,
      body: JSON.stringify({
        type: 'chat',
        sender: name,
        roomId: roomId,
        payload: {
          message: input,
        },
      }),
    });

    setInput('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-[600px]">
      <h2 className="text-xl font-bold mb-4">Chat</h2>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg ${
              msg.sender === name
                ? 'bg-blue-100 ml-auto max-w-[80%]'
                : msg.sender === 'System'
                ? 'bg-gray-100 text-center text-sm text-gray-600'
                : 'bg-gray-100 max-w-[80%]'
            }`}
          >
            <div className="font-semibold text-sm">{msg.sender}</div>
            <div>{msg.message}</div>
            <div className="text-xs text-gray-500 mt-1">
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!connected}
        />
        <button
          type="submit"
          disabled={!connected || !input.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
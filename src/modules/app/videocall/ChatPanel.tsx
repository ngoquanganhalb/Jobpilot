"use client";

import { useGetHistoryChat } from "@hooks/video-call/useGetHistoryChat";
import { useEffect, useRef, useState } from "react";

interface ChatPanelProps {
  stompClient: any;
  roomId: string;
  name: string;
  connected: boolean;
  onHide: () => void;
}

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: Date;
}

export default function ChatPanel({
  stompClient,
  roomId,
  name,
  connected,
  onHide,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historyLoadedRef = useRef(false);

  const { data: historyMessage, isLoading } = useGetHistoryChat(roomId);

  useEffect(() => {
    if (isLoading || !historyMessage || historyLoadedRef.current) return;

    const mappedHistory: ChatMessage[] = historyMessage.map((msg) => ({
      sender: msg.createUser,
      message: msg.message,
      timestamp: new Date(msg.updatedAt),
    }));

    setMessages(mappedHistory);
    historyLoadedRef.current = true;
  }, [isLoading, historyMessage]);

  useEffect(() => {
    if (!connected) return;

    const client = stompClient.current;
    if (!client) return;

    // console.log("📡 Setting up chat subscriptions for room:", roomId);

    const chatSub = client.subscribe(
      `/topic/room/${roomId}/chat`,
      (message: any) => {
        // console.log("💬 Chat message received:", message.body);
        const data = JSON.parse(message.body);
        setMessages((prev) => [
          ...prev,
          {
            sender: data.sender,
            message: data.payload.message,
            timestamp: new Date(),
          },
        ]);
      }
    );

    const systemSub = client.subscribe(
      `/topic/room/${roomId}/system`,
      (message: any) => {
        // console.log("🔔 System message received:", message.body);
        setMessages((prev) => [
          ...prev,
          {
            sender: "System",
            message: message.body,
            timestamp: new Date(),
          },
        ]);
      }
    );

    // console.log("✅ Chat subscriptions active");

    return () => {
      // console.log("🔌 Unsubscribing from chat");
      chatSub?.unsubscribe();
      systemSub?.unsubscribe();
    };
  }, [connected, roomId, stompClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !connected) return;

    stompClient.current.publish({
      destination: `/app/room/${roomId}/chat`,
      body: JSON.stringify({
        type: "chat",
        sender: name,
        roomId: roomId,
        payload: {
          message: input,
        },
      }),
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg">Messages</h2>
          <button
            onClick={onHide}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${
              msg.sender === "System"
                ? "text-center"
                : msg.sender === name
                ? "flex justify-end"
                : "flex justify-start"
            }`}
          >
            {msg.sender === "System" ? (
              <div className="text-gray-400 text-xs bg-gray-700 px-3 py-1 rounded-full inline-block">
                {msg.message}
              </div>
            ) : (
              <div
                className={`max-w-[80%] ${
                  msg.sender === name
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                } rounded-lg px-4 py-2`}
              >
                <div className="font-semibold text-xs mb-1 opacity-80">
                  {msg.sender}
                </div>
                <div className="break-words">{msg.message}</div>
                <div className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     placeholder-gray-400"
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!connected || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 disabled:bg-gray-600 
                     disabled:cursor-not-allowed transition font-medium"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

interface HeaderVideoProps {
  roomId: string;
  name: string;
}

export default function HeaderVideo({ roomId, name }: HeaderVideoProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h1 className="text-2xl font-bold">Video Call Room</h1>
      <div className="mt-2 text-gray-600">
        <p>Room ID: <span className="font-mono font-semibold">{roomId}</span></p>
        <p>Your Name: <span className="font-semibold">{name}</span></p>
      </div>
    </div>
  );
}
import { FaBell } from "react-icons/fa";

export default function NotificationButton() {
  return (
    <button className="relative p-2 hover:bg-gray-100 rounded-full">
      <FaBell className="text-xl text-gray-700" />
      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
    </button>
  );
}

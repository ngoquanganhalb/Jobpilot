"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { useNotificationSocket } from "@hooks/notification/useNotificationSocket";
import { useNotification } from "@hooks/notification/useNotification";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  useNotificationSocket(user?.id);
  const { notifications, unreadCount, refetch, markAsRead } = useNotification(
    user?.id
  );

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) refetch();
        }}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-130 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-3 font-semibold border-b">Notifications</div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="p-6 text-sm text-gray-500 text-center">
                You have no notifications
              </div>
            )}

            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markAsRead(n.id);
                  window.location.href = n.url;
                }}
                className={clsx(
                  "px-4 py-3 cursor-pointer transition border-b last:border-b-0",
                  n.read
                    ? "bg-white hover:bg-gray-50"
                    : "bg-blue-50 hover:bg-blue-100"
                )}
              >
                <div className="flex gap-3">
                  {/* DOT */}
                  {!n.read && (
                    <span className="mt-2 w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                  )}

                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-snug">
                      {n.message}
                    </p>

                    <span className="mt-1 block text-xs text-gray-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type WsNotificationPayload = {
  receiverId: number;
  type: string;
  message: string;
  url?: string;
};

export const useNotificationSocket = (userId?: number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS(
      `${process.env.NEXT_PUBLIC_API_JAVA_BASE_URL}/ws?userId=${userId}`
    );

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: {},
    });

    client.onConnect = () => {
      client.subscribe("/user/queue/notification", (msg) => {
        const noti: WsNotificationPayload = JSON.parse(msg.body);

        toast.info(noti.message, {
          position: "top-right",
          autoClose: 4000,
        });
        // 🔄 refetch notifications
        queryClient.invalidateQueries({
          queryKey: ["notifications", userId],
        });
      });
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [userId, queryClient]);
};

"use client";
import { WsNotificationRequest } from "@/dtos/notification/WsNotificationRequest";
import { createStompClient } from "@lib/stomp";
import { addNotification } from "@redux/slices/notificationSlice";
import { RootState } from "@redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function WSProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    const client = createStompClient(() => {
      //  SUBSCRIBE NOTIFICATION Ở ĐÂY
      client.subscribe("/topic/notification", (message) => {
        const payload = JSON.parse(message.body) as WsNotificationRequest;
        console.log("Received notification:", payload);
        if (payload.receiverId === user?.id) {
          dispatch(addNotification(payload));

          toast.info(payload.message);
        }
      });
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [user]);

  return <>{children}</>;
}

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const createStompClient = (onConnect: () => void) => {
  const client = new Client({
    webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_API_JAVA_BASE_URL}/ws`),
    debug: (str) => {
      console.log("STOMP: " + str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      console.log("Connected to WebSocket");
      onConnect();
    },
    onStompError: (frame) => {
      console.error("Broker error: " + frame.headers["message"]);
      console.error("Details: " + frame.body);
    },
  });

  return client;
};

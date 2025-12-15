import { useEffect } from "react";

interface Props {
  userId?: string;
  apiHost: string;
  wsProtocol: string;
}

export default function useVisitSocket({ userId, apiHost, wsProtocol }: Props) {
  useEffect(() => {
    const socket = new WebSocket(`${wsProtocol}://${apiHost}/ws/chat/1/`);

    socket.onopen = () => console.log(`WS Connected by User ${userId}`);
    socket.onclose = () => console.log(`WS Closed by User ${userId}`);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };

    return () => socket.close();
  }, [userId, apiHost, wsProtocol]);
}

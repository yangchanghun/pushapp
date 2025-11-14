import { useEffect } from "react";
import type { Message } from "../types/messages";

interface Props {
  userId?: string;
  apiHost: string;
  wsProtocol: string;
  soundEnabled: boolean;
  acceptAudio: React.MutableRefObject<HTMLAudioElement | null>;
  rejectAudio: React.MutableRefObject<HTMLAudioElement | null>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function useGuardSocket({
  userId,
  apiHost,
  wsProtocol,
  soundEnabled,
  acceptAudio,
  rejectAudio,
  setMessages,
}: Props) {
  useEffect(() => {
    const socket = new WebSocket(`${wsProtocol}://${apiHost}/ws/chat/1/`);

    socket.onopen = () => console.log(`WS Connected by User ${userId}`);
    socket.onclose = () => console.log(`WS Closed by User ${userId}`);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.message) return;

        const { message, token, createdAt } = data;
        const [sender, rest] = message.split(": ");
        const [visitor, text] = rest.split(" 방문");

        const newMsg: Message = {
          sender,
          visitor,
          text,
          token,
          createdAt,
        };

        setMessages((prev) => [...prev, newMsg]);

        // 사운드
        if (soundEnabled && sender !== `User_${userId}`) {
          if (text.includes("수락")) acceptAudio.current?.play();
          if (text.includes("거절")) rejectAudio.current?.play();
        }
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };

    return () => socket.close();
  }, [userId, soundEnabled, apiHost, wsProtocol]);
}

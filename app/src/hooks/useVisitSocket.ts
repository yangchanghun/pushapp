// hooks/useVisitSocket.ts
import { useEffect } from "react";
import type { Visitor } from "./useVisitors"; // 경로 맞게 수정
import acceptSound from "@/assets/voice/accept.mp3";
import rejectSound from "@/assets/voice/reject.mp3";
import newVisit from "@/assets/voice/newvisit.mp3";
import { playSound } from "../utils/PlaySound";
interface Props {
  userId?: string;
  apiHost: string;
  wsProtocol: string;
  onVisitorCreated?: (visitor: Visitor) => void;
  onVisitorStatusUpdated?: (token: string, status: string) => void;
}

export default function useVisitSocket({
  userId,
  apiHost,
  wsProtocol,
  onVisitorCreated,
  onVisitorStatusUpdated,
}: Props) {
  useEffect(() => {
    const socket = new WebSocket(`${wsProtocol}://${apiHost}/ws/chat/1/`);

    socket.onopen = () => console.log(`WS Connected by User ${userId}`);
    socket.onclose = () => console.log(`WS Closed by User ${userId}`);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "visitor_created") {
          onVisitorCreated?.(data.visitor);
          playSound(newVisit);
        }

        if (data.type === "visitor_status_updated") {
          onVisitorStatusUpdated?.(data.token, data.status);

          if (data.status === "수락") {
            playSound(acceptSound);
          }
          if (data.status === "거절") {
            playSound(rejectSound);
          }
        }
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };

    return () => socket.close();
  }, [
    userId,
    apiHost,
    wsProtocol,
    onVisitorCreated,
    onVisitorStatusUpdated, // ✅ 추가
  ]);
}

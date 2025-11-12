import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import acceptSound from "@/assets/voice/accept.mp3";
import rejectSound from "@/assets/voice/reject.mp3";
import ChatComponent from "../components/ChatComponent";

type Message = {
  sender: string;
  text: string;
  token: string;
  visitor: string;
};

export default function GaurdPage() {
  const { userId } = useParams();
  const [, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const acceptAudio = useRef<HTMLAudioElement | null>(null);
  const rejectAudio = useRef<HTMLAudioElement | null>(null);

  const apiBase = import.meta.env.VITE_API_URL;
  const apiHost = apiBase.replace(/^https?:\/\//, "");
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";

  // ✅ 1. 기존 방문기록 불러오기
  useEffect(() => {
    const fetchOldMessages = async () => {
      try {
        const res = await fetch(`${apiBase}/api/visit/checked/`);
        const data = await res.json();

        const formatted = data.map((item: any) => ({
          sender: item.professor_name || "교수",
          visitor: item.name,
          text: `을 ${item.status}했습니다.`,
          token: item.token,
        }));

        setMessages(formatted);
        console.log("✅ 기존 방문기록 불러옴:", formatted);
      } catch (err) {
        console.error("❌ 기존 메시지 불러오기 실패:", err);
      }
    };
    fetchOldMessages();
  }, [apiBase]);

  // ✅ 2. WebSocket 연결
  useEffect(() => {
    acceptAudio.current = new Audio(acceptSound);
    rejectAudio.current = new Audio(rejectSound);

    const socket = new WebSocket(`${wsProtocol}://${apiHost}/ws/chat/1/`);
    setWs(socket);

    socket.onopen = () => console.log(`✅ [User ${userId}] 연결됨`);
    socket.onclose = () => console.log(`❌ [User ${userId}] 연결 종료`);
    socket.onerror = (err) => console.error(`⚠️ [User ${userId}] 에러:`, err);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.message) return;

        const { message, token } = data;
        const [sender, rest] = message.split(": ");
        const [visitor, text] = rest.split(" 방문");

        const newMsg = {
          sender,
          visitor,
          text: `${text}`,
          token,
        };

        // ✅ 실시간 추가
        setMessages((prev) => [...prev, newMsg]);

        // 🔊 알림
        if (soundEnabled && sender !== `User_${userId}`) {
          if (text.includes("수락")) acceptAudio.current?.play();
          else if (text.includes("거절")) rejectAudio.current?.play();
        }
      } catch (err) {
        console.warn("⚠️ JSON 파싱 실패:", event.data, err);
      }
    };

    return () => socket.close();
  }, [userId, soundEnabled, apiHost, wsProtocol]);

  const handleEnableSound = () => {
    setSoundEnabled(true);
    if (acceptAudio.current && rejectAudio.current) {
      [acceptAudio.current, rejectAudio.current].forEach((audio) => {
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
        });
      });
    }
    console.log("🔔 소리 허용됨");
  };

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 400,
        margin: "0 auto",
        border: "1px solid #ccc",
        borderRadius: 10,
        background: "#f5f5f5",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ textAlign: "center" }}>경비원</h2>

      {!soundEnabled && (
        <button
          onClick={handleEnableSound}
          style={{
            background: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 16px",
            margin: "8px auto",
            cursor: "pointer",
          }}
        >
          🔊 알림(소리) 허용
        </button>
      )}

      <ChatComponent messages={messages} userId={userId} />
    </div>
  );
}

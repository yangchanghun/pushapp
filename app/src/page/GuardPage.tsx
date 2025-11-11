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
  // const [input, setInput] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);

  // 🎧 미리 로드한 오디오 객체를 useRef로 관리
  const acceptAudio = useRef<HTMLAudioElement | null>(null);
  const rejectAudio = useRef<HTMLAudioElement | null>(null);

  const apiHost = import.meta.env.VITE_API_URL.replace(/^https?:\/\//, "");
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";

  useEffect(() => {
    acceptAudio.current = new Audio(acceptSound);
    rejectAudio.current = new Audio(rejectSound);
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`${wsProtocol}://${apiHost}/ws/chat/1/`);
    setWs(socket);

    socket.onopen = () => console.log(`✅ [User ${userId}] 연결됨`);
    socket.onclose = () => console.log(`❌ [User ${userId}] 연결 종료`);
    socket.onerror = (err) => console.error(`⚠️ [User ${userId}] 에러:`, err);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const token = JSON.parse(data.token);
      // const parts = data.message.split(": ");
      // const sender = parts[0];
      // const text = parts.slice(1).join(": ");
      const [sender, rest] = data.split(": ");
      const [visitor, text] = rest.split(" 방문");

      if (data.message.startsWith("✅")) return;
      setMessages((prev) => [...prev, { sender, text, token, visitor }]);

      // 🎧 버튼으로 허용된 상태일 때만 재생
      if (soundEnabled && sender !== `User_${userId}`) {
        if (text.includes("수락")) {
          acceptAudio.current
            ?.play()
            .catch((err) => console.warn("Play blocked:", err));
        } else if (text.includes("거절")) {
          rejectAudio.current
            ?.play()
            .catch((err) => console.warn("Play blocked:", err));
        }
      }
    };

    return () => socket.close();
  }, [userId, soundEnabled]);

  // const sendMessage = () => {
  //   if (ws && ws.readyState === WebSocket.OPEN && input.trim() !== "") {
  //     ws.send(JSON.stringify({ sender: `User_${userId}`, message: input }));
  //     setInput("");
  //   }
  // };

  const handleEnableSound = () => {
    setSoundEnabled(true);
    // 🔊 사용자 제스처로 오디오 컨텍스트 활성화
    if (acceptAudio.current && rejectAudio.current) {
      acceptAudio.current.play().then(() => {
        acceptAudio.current!.pause();
        acceptAudio.current!.currentTime = 0;
      });
      rejectAudio.current.play().then(() => {
        rejectAudio.current!.pause();
        rejectAudio.current!.currentTime = 0;
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
      {/* <h2 style={{ textAlign: "center" }}>💬 Chat Room - User {userId}</h2> */}
      <h2 style={{ textAlign: "center" }}>경비원</h2>
      {/* 🔊 알림 허용 버튼 */}
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
      {/* 채팅창 */}
      <ChatComponent messages={messages} userId={userId} />
    </div>
  );
}

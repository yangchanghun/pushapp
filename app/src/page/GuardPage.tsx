import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import acceptSound from "@/assets/voice/accept.mp3";
import rejectSound from "@/assets/voice/reject.mp3";
import ChatComponent from "../components/ChatComponent";
import axios from "axios";

type Message = {
  sender: string;
  text: string;
  token: string;
  visitor: string;
};

export default function GuardPage() {
  const { userId } = useParams();
  const [, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const apiHost = API_URL.replace(/^https?:\/\//, "");
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";

  // 🎧 사운드 준비
  const acceptAudio = useRef<HTMLAudioElement | null>(null);
  const rejectAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    acceptAudio.current = new Audio(acceptSound);
    rejectAudio.current = new Audio(rejectSound);
  }, []);

  // ✅ 초기 방문자 데이터 가져오기 (덮어쓰기 ❌ 병합 ✅)
  const fetchInitial = async () => {
    try {
      const [noChecked] = await Promise.all([
        axios.get(`${API_URL}/api/visit/no_checked/`),
        axios.get(`${API_URL}/api/visit/checked/`),
      ]);

      const pendingMessages: Message[] = noChecked.data.map((v: any) => ({
        sender: v.professor_name || "시스템",
        visitor: v.name,
        text: "방문 요청이 도착했습니다.",
        token: v.token,
      }));

      // 🔥 기존 메시지와 병합 (덮어쓰기 금지)
      setMessages((prev) => {
        const existingTokens = new Set(prev.map((m) => m.token));
        const newOnes = pendingMessages.filter(
          (m) => !existingTokens.has(m.token)
        );
        return [...prev, ...newOnes];
      });

      console.log("✅ 초기 방문자 로드 완료");
    } catch (err) {
      console.error("❌ 초기 방문자 불러오기 실패:", err);
    }
  };

  // ✅ 페이지 최초 진입 시 한 번 실행
  useEffect(() => {
    fetchInitial();
  }, []);

  // ✅ WebSocket 연결
  useEffect(() => {
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

        // ✅ 새 메시지 추가 (중복 방지)
        setMessages((prev) => {
          const exists = prev.some((m) => m.token === token && m.text === text);
          if (exists) return prev;
          return [...prev, { sender, visitor, text: text || "", token }];
        });

        // 🔊 사운드 알림
        if (soundEnabled && sender !== `User_${userId}`) {
          if (text?.includes("수락")) {
            acceptAudio.current?.play().catch(() => {});
          } else if (text?.includes("거절")) {
            rejectAudio.current?.play().catch(() => {});
          }
        }
      } catch (err) {
        console.warn("⚠️ JSON 파싱 실패:", event.data, err);
      }
    };

    return () => socket.close();
  }, [userId, soundEnabled]);

  // ✅ 소리 허용
  const handleEnableSound = () => {
    setSoundEnabled(true);
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
        maxWidth: 420,
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

      {/* ✅ 채팅 메시지 표시 */}
      <ChatComponent messages={messages} userId={userId} />
    </div>
  );
}

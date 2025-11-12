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
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [checkedVisitors, setCheckedVisitors] = useState<any[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  // 🎧 사운드 객체
  const acceptAudio = useRef<HTMLAudioElement | null>(null);
  const rejectAudio = useRef<HTMLAudioElement | null>(null);

  const apiHost = API_URL.replace(/^https?:\/\//, "");
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";

  // ✅ 사운드 초기화
  useEffect(() => {
    acceptAudio.current = new Audio(acceptSound);
    rejectAudio.current = new Audio(rejectSound);
  }, []);

  // ✅ 소리 허용 버튼
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

  // ✅ 초기 데이터 불러오기
  const fetchInitial = async () => {
    try {
      const [noChecked, checked] = await Promise.all([
        axios.get(`${API_URL}/api/visit/no_checked/`),
        axios.get(`${API_URL}/api/visit/checked/`),
      ]);

      const pendingMessages: Message[] = noChecked.data.map((v: any) => ({
        sender: v.professor_name || "없음",
        visitor: v.name,
        text: "요청이 도착했습니다.",
        token: v.token,
      }));

      setMessages((prev) => {
        // ✅ 이미 있는 토큰 중복 방지
        const existingTokens = new Set(prev.map((m) => m.token));
        const newOnes = pendingMessages.filter(
          (m) => !existingTokens.has(m.token)
        );
        return [...prev, ...newOnes];
      });

      setCheckedVisitors(checked.data);
      console.log("✅ 초기 방문자 불러오기 완료");
    } catch (err) {
      console.error("❌ 초기 데이터 불러오기 실패:", err);
    }
  };

  // ✅ WebSocket 연결 (fetchInitial 이후 실행)
  const connectWebSocket = () => {
    const socket = new WebSocket(`${wsProtocol}://${apiHost}/ws/chat/1/`);
    setWs(socket);

    socket.onopen = () => console.log(`✅ [User ${userId}] 연결됨`);
    socket.onclose = () => console.log(`❌ [User ${userId}] 연결 종료`);
    socket.onerror = (err) => console.error(`⚠️ [User ${userId}] 에러:`, err);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 WebSocket 메시지:", data);

        if (!data.message || !data.message.includes(": ")) return;

        const { message, token } = data;
        const [sender, rest] = message.split(": ");
        const [visitor, text] = rest.split(" 방문");

        setMessages((prev) => [
          ...prev,
          { sender, visitor, text: text?.trim() || "", token },
        ]);

        // 🔊 소리 알림
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
      } catch (err) {
        console.warn("⚠️ JSON 파싱 실패:", event.data, err);
      }
    };
  };

  // ✅ 실행 순서 보장: fetch → ws
  useEffect(() => {
    const init = async () => {
      await fetchInitial();
      connectWebSocket();
    };
    init();

    // cleanup
    return () => {
      ws?.close();
    };
  }, []);

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

      {/* ✅ 확인된 방문자 목록 */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 10,
          background: "#fff",
          overflowY: "auto",
          padding: 10,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            background: "#16a34a",
            color: "white",
            margin: 0,
            padding: "10px 0",
          }}
        >
          ✅ 확인된 방문자
        </h2>

        {checkedVisitors.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
            아직 확인된 방문자 없음
          </p>
        ) : (
          checkedVisitors.map((v) => (
            <div
              key={v.id}
              style={{
                borderBottom: "1px solid #eee",
                padding: "8px 4px",
                fontSize: 14,
              }}
            >
              <strong>{v.name}</strong>
              <p style={{ margin: 0 }}>{v.visit_purpose}</p>
              <small style={{ color: "#999" }}>
                {new Date(v.created_at).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import acceptSound from "@/assets/voice/accept.mp3";
import rejectSound from "@/assets/voice/reject.mp3";
import ChatComponent from "../components/ChatComponent";
// import axios from "axios";
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
  // const API_URL = import.meta.env.VITE_API_URL;
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
      try {
        const data = JSON.parse(event.data); // ✅ { message, token }

        if (!data.message) return; // 연결확인용 메시지 무시

        const { message, token } = data;

        // 💬 "홍길동 방문을 수락했습니다" 파싱
        const [sender, rest] = message.split(": ");
        const [visitor, text] = rest.split(" 방문");

        setMessages((prev) => [
          ...prev,
          { sender, visitor, text: `${text}`, token },
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

    return () => socket.close();
  }, [userId, soundEnabled]);

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

  // const [checkedVisitors, setCheckedVisitors] = useState<any[]>([]);
  // const fetchInitial = async () => {
  //   try {
  //     const [noChecked, checked] = await Promise.all([
  //       axios.get(`${API_URL}/api/visit/no_checked/`),
  //       axios.get(`${API_URL}/api/visit/checked/`),
  //     ]);
  //     console.log(noChecked);
  //     console.log(checked);
  //     const pendingMessages: Message[] = noChecked.data.map((v) => ({
  //       sender: v.professor_name || "없음",
  //       visitor: v.name,
  //       text: "방문을 수락했습니다",
  //       token: v.token,
  //     }));
  //     setMessages(pendingMessages);
  //     setCheckedVisitors(checked.data);
  //   } catch (err) {
  //     console.log("에러", err);
  //   }
  // };

  // useEffect(() => {
  //   fetchInitial();
  // }, []);

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
      {/* {checkedVisitors.length === 0 ? (
        <div>현재확인된 방문자없음</div>
      ) : (
        checkedVisitors.map((v: any) => <div>{v.name}</div>)
      )} */}
    </div>
  );
}

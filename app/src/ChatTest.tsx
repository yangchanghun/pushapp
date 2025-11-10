import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// 경비원 1채팅방 접속 => 교수가 허락 혹은 거절을 보냄 => 백엔드 서버에서 웹소켓 1채널을 통해 데이터를 보냄 => 그럼 채팅추가 되겠찌? 그리고
//       if (sender !== `User_${userId}` && data) {
//            console.log(`💬 답장이 옴 → ${text}`);
//        } 을 음성메시지로 바꾼다 문자왔습니다음성으로 ㄱ

// 메인페이지 방문등록폼있고 우측상단 관리자전환버튼 있고
type Message = {
  sender: string;
  text: string;
};

export default function ChatRoom() {
  const { userId } = useParams(); // /1, /2
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [voiceSrc, setVoiceSrc] = useState<string | null>(null);

  const apiHost = import.meta.env.VITE_API_URL.replace(/^https?:\/\//, "");
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  const API_URL = import.meta.env.VITE_API_URL;
  console.log(API_URL);
  useEffect(() => {
    const socket = new WebSocket(`${wsProtocol}://${apiHost}/ws/chat/1/`);
    setWs(socket);

    socket.onopen = () => console.log(`✅ [User ${userId}] 연결됨`);
    socket.onclose = () => console.log(`❌ [User ${userId}] 연결 종료`);
    socket.onerror = (err) => console.error(`⚠️ [User ${userId}] 에러:`, err);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // 메시지에 sender 정보가 함께 온다고 가정
      // (Django에서 sender도 같이 보내면 좋음)
      const parts = data.message.split(": ");
      const sender = parts[0];
      const text = parts.slice(1).join(": ");
      if (data.message.startsWith("✅")) return;
      setMessages((prev) => [...prev, { sender, text }]);
      if (sender !== `User_${userId}` && data) {
        console.log(`💬 답장이 옴 → ${text}`);

        // ✅ 수락 / 거절 / 일반 감지 후 음성파일 경로 지정
        if (text.includes("수락")) {
          console.log("수락됨?");
          setVoiceSrc("/voice/accept.mp3");
          console.log(voiceSrc);
        } else if (text.includes("거절")) {
          console.log("거절됨?");

          setVoiceSrc("/voice/reject.mp3");
        }
      }
      if (Notification.permission === "granted") {
        const n = new Notification("새 메시지 도착!", {
          body: text,
          icon: "/icon.png", // (선택) 알림 아이콘 추가 가능
        });

        n.onclick = function (event) {
          event.preventDefault(); // 기본 동작(포커스 등) 방지
          window.open("http://pushapp.kioedu.co.kr/1", "_blank");
        };
      }
    };

    return () => socket.close();
  }, [userId]);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN && input.trim() !== "") {
      console.log(ws);
      ws.send(JSON.stringify({ sender: `User_${userId}`, message: input }));
      console.log("'내가'보냄");
      setInput("");
    }
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
      <h2 style={{ textAlign: "center" }}>💬 Chat Room - User {userId}</h2>
      {voiceSrc && <audio src={voiceSrc} autoPlay />}
      <audio src="/voice/reject.mp3" autoPlay />
      {/* 채팅창 */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          padding: 10,
        }}
      >
        {messages.map((msg, i) => {
          const isMine = msg.sender === `User_${userId}`;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: isMine ? "flex-end" : "flex-start",
              }}
            >
              {!isMine && (
                <div style={{ textAlign: "left", fontSize: 11, color: "#666" }}>
                  {msg.sender}
                </div>
              )}
              <div
                style={{
                  backgroundColor: isMine ? "#DCF8C6" : "#fff",
                  color: "#111",
                  padding: "8px 12px",
                  borderRadius: 12,
                  maxWidth: "70%",
                  wordBreak: "break-word",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                }}
              >
                <div style={{ textAlign: "left" }}>{msg.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 입력창 */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 10,
          borderTop: "1px solid #ccc",
          background: "#fff",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지 입력..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
}

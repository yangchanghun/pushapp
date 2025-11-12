import { useState, useRef, useEffect } from "react";
import VisitorDetailModal from "../modal/VisitConfirm";

type Message = {
  sender: string;
  visitor: string;
  text: string;
  token: string;
};

interface ChatComponentProps {
  messages: Message[];
  userId: string | undefined;
}

export default function ChatComponent({
  messages,
  userId,
}: ChatComponentProps) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  // ✅ 스크롤 가능한 컨테이너 ref
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // ✅ 페이지 렌더 완료 후 맨 아래로 스크롤 (새로고침 시)
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      // 렌더 끝난 뒤 스크롤 이동 (setTimeout으로 딜레이 1프레임 줌)
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "auto", // 부드럽게 하고 싶다면 "smooth"
        });
      }, 0);
    }
  }, []); // ✅ 새로고침(마운트) 시 한 번만 실행

  return (
    <div
      ref={chatContainerRef}
      style={{
        flex: 1,
        overflowY: "auto", // ✅ 스크롤 가능해야 함
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: 10,
        minWidth: "500px",
        height: "100%",
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
              <div
                style={{
                  textAlign: "left",
                  fontSize: 15,
                  color: "black",
                  fontWeight: "600",
                }}
              >
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
              <div style={{ textAlign: "left" }}>
                <span
                  style={{ fontSize: "20px", color: "red", fontWeight: "600" }}
                >
                  {msg.visitor}님
                </span>
                방문{msg.text}
                <button
                  onClick={() => setSelectedToken(msg.token)}
                  style={{
                    marginLeft: "10px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {selectedToken && (
        <VisitorDetailModal
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </div>
  );
}

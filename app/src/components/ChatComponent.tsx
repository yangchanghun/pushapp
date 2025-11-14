import { useState, useRef, useLayoutEffect } from "react";
import VisitorDetailModal from "../modal/VisitConfirm";
import type { Message } from "../types/messages";

interface ChatComponentProps {
  messages: Message[];
  userId: string | undefined;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setCheckedMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ChatComponent({
  messages,
  userId,
  setMessages,
  setCheckedMessages,
}: ChatComponentProps) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  // ✅ 스크롤 가능한 컨테이너 ref
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  console.log(messages);
  // ✅ 렌더 직후 항상 맨 아래로 (초기 진입 + 새로고침 포함)
  useLayoutEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages.length]); // messages가 로드된 뒤 바로 아래로

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
        height: "100%", // ✅ 부모 높이 기반
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
                <span> {new Date(msg.createdAt).toLocaleString()}</span>
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
          setMessages={setMessages}
          setCheckedMessages={setCheckedMessages}
        />
      )}
    </div>
  );
}

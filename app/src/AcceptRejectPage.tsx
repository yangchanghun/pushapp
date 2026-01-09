// 경비원 1채팅방 접속 => 교수가 허락 혹은 거절을 보냄 => 백엔드 서버에서 웹소켓 1채널을 통해 데이터를 보냄 => 그럼 채팅추가 되겠찌? 그리고
//       if (sender !== `User_${userId}` && data) {
//            console.log(`💬 답장이 옴 → ${text}`);
//        } 을 음성메시지로 바꾼다 문자왔습니다음성으로 ㄱ

// 메인페이지 방문등록폼있고 우측상단 관리자전환버튼 있고
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
type VisitorInfo = {
  name: string;
  visit_purpose: string;
  professor?: string | null;
};

export default function AcceptRejectPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [visitor, setVisitor] = useState<VisitorInfo | null>(null);
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await fetch(`${API_URL}/api/visit/check/${token}/`);
        const data = await res.json();

        if (res.ok && data.valid) {
          setValid(true);
          setVisitor(data.visitor);
        } else {
          setMessage(data.message || "잘못된 요청입니다.");
        }
      } catch (err) {
        console.error(err);
        setMessage("❌ 서버 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, [token, API_URL]);

  const handleAction = async (action: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/visit/${action}/${token}/`);
      console.log(res);
      const text = await res.text();
      setMessage(text);
      setValid(false);
    } catch {
      setMessage("❌ 서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>로딩 중...</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "Pretendard, sans-serif",
        background: "#f9fafb",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem 3rem",
          borderRadius: "1.5rem",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          textAlign: "center",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        {valid && visitor ? (
          <>
            <h2>📩 방문 요청 처리</h2>
            <p style={{ color: "#555" }}>
              <b>{visitor.name}</b> 님의 방문 요청입니다. <br />
              목적: {visitor.visit_purpose}
            </p>

            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              {/* daskjhdashadfjdwfdjwhsda"dfdfc= */}
              <button
                onClick={() => handleAction("accept")}
                style={{
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                ✅ 수락
              </button>
              <button
                onClick={() => handleAction("reject")}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                ❌ 거절
              </button>
            </div>
          </>
        ) : (
          <h2 style={{ color: "#ef4444" }}>{message}</h2>
        )}
      </div>
    </div>
  );
}

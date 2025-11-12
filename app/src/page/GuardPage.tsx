// import { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import acceptSound from "@/assets/voice/accept.mp3";
// import rejectSound from "@/assets/voice/reject.mp3";
// import ChatComponent from "../components/ChatComponent";
// type Message = {
//   sender: string;
//   text: string;
//   token: string;
//   visitor: string;
// };

// export default function GaurdPage() {
//   const { userId } = useParams();
//   const [, setWs] = useState<WebSocket | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   // const [input, setInput] = useState("");
//   const [soundEnabled, setSoundEnabled] = useState(false);

//   // 🎧 미리 로드한 오디오 객체를 useRef로 관리
//   const acceptAudio = useRef<HTMLAudioElement | null>(null);
//   const rejectAudio = useRef<HTMLAudioElement | null>(null);

//   const apiHost = import.meta.env.VITE_API_URL.replace(/^https?:\/\//, "");
//   const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";

//   useEffect(() => {
//     acceptAudio.current = new Audio(acceptSound);
//     rejectAudio.current = new Audio(rejectSound);
//   }, []);

//   useEffect(() => {
//     const socket = new WebSocket(`${wsProtocol}://${apiHost}/ws/chat/1/`);
//     setWs(socket);

//     socket.onopen = () => console.log(`✅ [User ${userId}] 연결됨`);
//     socket.onclose = () => console.log(`❌ [User ${userId}] 연결 종료`);
//     socket.onerror = (err) => console.error(`⚠️ [User ${userId}] 에러:`, err);

//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data); // ✅ { message, token }

//         if (!data.message) return; // 연결확인용 메시지 무시

//         const { message, token } = data;

//         // 💬 "홍길동 방문을 수락했습니다" 파싱
//         const [sender, rest] = message.split(": ");
//         const [visitor, text] = rest.split(" 방문");

//         setMessages((prev) => [
//           ...prev,
//           { sender, visitor, text: `${text}`, token },
//         ]);

//         // 🔊 소리 알림
//         if (soundEnabled && sender !== `User_${userId}`) {
//           if (text.includes("수락")) {
//             acceptAudio.current
//               ?.play()
//               .catch((err) => console.warn("Play blocked:", err));
//           } else if (text.includes("거절")) {
//             rejectAudio.current
//               ?.play()
//               .catch((err) => console.warn("Play blocked:", err));
//           }
//         }
//       } catch (err) {
//         console.warn("⚠️ JSON 파싱 실패:", event.data, err);
//       }
//     };

//     return () => socket.close();
//   }, [userId, soundEnabled]);

//   // const sendMessage = () => {
//   //   if (ws && ws.readyState === WebSocket.OPEN && input.trim() !== "") {
//   //     ws.send(JSON.stringify({ sender: `User_${userId}`, message: input }));
//   //     setInput("");
//   //   }
//   // };

//   const handleEnableSound = () => {
//     setSoundEnabled(true);
//     // 🔊 사용자 제스처로 오디오 컨텍스트 활성화
//     if (acceptAudio.current && rejectAudio.current) {
//       acceptAudio.current.play().then(() => {
//         acceptAudio.current!.pause();
//         acceptAudio.current!.currentTime = 0;
//       });
//       rejectAudio.current.play().then(() => {
//         rejectAudio.current!.pause();
//         rejectAudio.current!.currentTime = 0;
//       });
//     }
//     console.log("🔔 소리 허용됨");
//   };

//   return (
//     <div
//       style={{
//         padding: 20,
//         maxWidth: 400,
//         margin: "0 auto",
//         border: "1px solid #ccc",
//         borderRadius: 10,
//         background: "#f5f5f5",
//         height: "90vh",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* <h2 style={{ textAlign: "center" }}>💬 Chat Room - User {userId}</h2> */}
//       <h2 style={{ textAlign: "center" }}>경비원</h2>
//       {/* 🔊 알림 허용 버튼 */}
//       {!soundEnabled && (
//         <button
//           onClick={handleEnableSound}
//           style={{
//             background: "#3B82F6",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             padding: "10px 16px",
//             margin: "8px auto",
//             cursor: "pointer",
//           }}
//         >
//           🔊 알림(소리) 허용
//         </button>
//       )}
//       {/* 채팅창 */}
//       <ChatComponent messages={messages} userId={userId} />
//     </div>
//   );
// }
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import acceptSound from "@/assets/voice/accept.mp3";
import rejectSound from "@/assets/voice/reject.mp3";

type Visitor = {
  id: number;
  name: string;
  visit_purpose: string;
  phonenumber: string;
  token: string;
  created_at: string;
  status: string;
  is_checked: boolean;
};

const API_URL = "https://pushapp.kioedu.co.kr";

export default function GaurdPage() {
  const { userId } = useParams();
  const [, setWs] = useState<WebSocket | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [uncheckedList, setUncheckedList] = useState<Visitor[]>([]);
  const [checkedList, setCheckedList] = useState<Visitor[]>([]);
  const acceptAudio = useRef<HTMLAudioElement | null>(null);
  const rejectAudio = useRef<HTMLAudioElement | null>(null);

  const apiHost = import.meta.env.VITE_API_URL.replace(/^https?:\/\//, "");
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";

  // ✅ 초기 방문자 리스트 로드
  const fetchVisits = async () => {
    try {
      const [noChecked, checked] = await Promise.all([
        axios.get(`${API_URL}/api/visit/no_checked/`),
        axios.get(`${API_URL}/api/visit/checked/`),
      ]);
      setUncheckedList(noChecked.data);
      setCheckedList(checked.data);
    } catch (err) {
      console.error("❌ 방문자 목록 로드 실패:", err);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  // 🎧 사운드 객체 준비
  useEffect(() => {
    acceptAudio.current = new Audio(acceptSound);
    rejectAudio.current = new Audio(rejectSound);
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

        const { message } = data;

        // 예시: "홍길동 방문 요청"
        if (message.includes("방문 요청")) {
          const visitorName = message.split(" ")[0];
          console.log(`🆕 새 방문 요청: ${visitorName}`);
          fetchVisits(); // 리스트 갱신
        }

        // 🔊 소리 알림
        if (soundEnabled) {
          if (message.includes("수락")) {
            acceptAudio.current?.play().catch(() => {});
          } else if (message.includes("거절")) {
            rejectAudio.current?.play().catch(() => {});
          }
        }
      } catch (err) {
        console.warn("⚠️ JSON 파싱 실패:", event.data, err);
      }
    };

    return () => socket.close();
  }, [userId, soundEnabled]);

  // ✅ 경비원 확인 버튼 클릭 시
  const handleConfirm = async (token: string) => {
    try {
      await axios.post(`${API_URL}/api/visit/check/`, { token });
      // ✅ 리스트에서 이동
      setUncheckedList((prev) => prev.filter((v) => v.token !== token));
      const confirmed = uncheckedList.find((v) => v.token === token);
      if (confirmed) setCheckedList((prev) => [confirmed, ...prev]);
    } catch (err) {
      console.error("❌ 확인 요청 실패:", err);
    }
  };

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
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        padding: 20,
        height: "90vh",
      }}
    >
      {/* 🔊 알림 허용 버튼 */}
      {!soundEnabled && (
        <button
          onClick={handleEnableSound}
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          🔊 알림(소리) 허용
        </button>
      )}

      {/* 🚫 미확인 방문자 리스트 */}
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          padding: 16,
          overflowY: "auto",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#e11d48" }}>
          🚫 미확인 방문자
        </h2>
        {uncheckedList.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            현재 미확인 방문자 없음
          </p>
        ) : (
          uncheckedList.map((v) => (
            <div
              key={v.token}
              style={{
                borderBottom: "1px solid #eee",
                padding: "8px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{v.name}</strong>
                <p style={{ fontSize: 13, margin: 0 }}>{v.visit_purpose}</p>
                <p style={{ fontSize: 12, color: "#999", margin: 0 }}>
                  {new Date(v.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleConfirm(v.token)}
                style={{
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                확인
              </button>
            </div>
          ))
        )}
      </div>

      {/* ✅ 확인된 방문자 리스트 */}
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          padding: 16,
          overflowY: "auto",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#2563eb" }}>
          ✅ 확인된 방문자
        </h2>
        {checkedList.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            아직 확인된 방문자 없음
          </p>
        ) : (
          checkedList.map((v) => (
            <div
              key={v.token}
              style={{
                borderBottom: "1px solid #eee",
                padding: "8px 0",
              }}
            >
              <strong>{v.name}</strong>
              <p style={{ fontSize: 13, margin: 0 }}>{v.visit_purpose}</p>
              <p style={{ fontSize: 12, color: "#999", margin: 0 }}>
                {new Date(v.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

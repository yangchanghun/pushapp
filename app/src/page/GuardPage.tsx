import { useParams, useNavigate } from "react-router-dom";
import ChatComponent from "../components/ChatComponent";
import CheckedChatComponent from "../components/CheckedChatComponent";
import { useEffect } from "react";
import useFetchVisits from "../hooks/useFetchVisits";
import useGuardSound from "../hooks/useGuardSound";
import useGuardSocket from "../hooks/useGuardSocket";

export default function GaurdPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const apiBase = import.meta.env.VITE_API_URL;
  const apiHost = apiBase.replace(/^https?:\/\//, "");
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";

  const { messages, checkedMessages, setMessages, setCheckedMessages } =
    useFetchVisits(apiBase);

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);
  const { soundEnabled, toggleSound, acceptAudio, rejectAudio } =
    useGuardSound();

  useGuardSocket({
    userId,
    apiHost,
    wsProtocol,
    soundEnabled,
    acceptAudio,
    rejectAudio,
    setMessages,
  });

  // 🔵 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem("token"); // 토큰 삭제
    navigate("/admin/login"); // 로그인 페이지로 이동
  };
  if (Notification.permission === "granted") {
    const n = new Notification("새 메시지 도착!", {
      body: "새로운 방문자가 등록되었습니다",
      icon: "/icon.png", // (선택) 알림 아이콘 추가 가능
    });

    n.onclick = function (event) {
      event.preventDefault(); // 기본 동작(포커스 등) 방지
      window.open("http://push.kioedu.co.kr/admin", "_blank");
    };
  }

  return (
    <div className="flex h-screen w-screen relative">
      <button
        onClick={() => {
          navigate("/admin/page");
        }}
        className="z-50 absolute top-5 left-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
      >
        관리자 페이지
      </button>
      <button
        onClick={handleLogout}
        className="absolute top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
      >
        로그아웃
      </button>
      <div className="flex w-1/2 items-center justify-center relative">
        {/* 🔵 로그아웃 버튼 */}

        <div className="flex flex-col items-center justify-center w-[50%]">
          <div className="flex flex-col p-5 w-[400px] h-[90vh] bg-[#9bbbd4] rounded-xl shadow-lg">
            <h2 className="text-center text-xl font-semibold mb-3">경비원</h2>

            {/* {!soundEnabled && (
              <button
                onClick={enableSound}
                className="bg-blue-500 text-white rounded-lg py-2 px-4 mb-3 hover:bg-blue-600"
              >
                🔊 알림(소리) 허용
              </button>
            )} */}
            {/* 🔊 소리 ON/OFF 토글 스위치 */}
            <div className="flex items-center mb-4">
              <span className="mr-3">
                {soundEnabled ? "🔊 소리 ON" : "🔇 소리 OFF"}
              </span>

              <button
                onClick={toggleSound}
                className={`
      relative inline-flex h-6 w-12 items-center rounded-full transition
      ${soundEnabled ? "bg-green-500" : "bg-gray-400"}
    `}
              >
                <span
                  className={`
        inline-block h-5 w-5 transform rounded-full bg-white transition
        ${soundEnabled ? "translate-x-6" : "translate-x-1"}
      `}
                />
              </button>
            </div>
            <ChatComponent
              messages={messages}
              userId={userId}
              setMessages={setMessages}
              setCheckedMessages={setCheckedMessages}
            />
          </div>
        </div>
      </div>

      {/* 오른쪽 */}
      <div className="flex w-1/2 items-center justify-center border-l">
        <div className="flex flex-col items-center justify-center w-[50%]">
          <div className="flex flex-col border p-5 w-[400px] h-[90vh] bg-white rounded-xl shadow-lg">
            <h2 className="text-center text-xl font-semibold mb-3">
              ✅ 확인 완료
            </h2>

            <CheckedChatComponent messages={checkedMessages} userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import ChatComponent from "../components/ChatComponent";
import CheckedChatComponent from "../components/CheckedChatComponent";

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

  const { soundEnabled, enableSound, acceptAudio, rejectAudio } =
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

  return (
    <div className="flex h-screen w-screen relative">
      {/* 왼쪽 */}
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

            {!soundEnabled && (
              <button
                onClick={enableSound}
                className="bg-blue-500 text-white rounded-lg py-2 px-4 mb-3 hover:bg-blue-600"
              >
                🔊 알림(소리) 허용
              </button>
            )}

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

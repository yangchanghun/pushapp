import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center gap-4 z-10">
      <button
        onClick={() => navigate("/1")}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg"
      >
        경비원실로
      </button>

      <button
        onClick={() => navigate("/visitor/register")}
        className="px-6 py-3 bg-green-500 text-white rounded-lg"
      >
        방문등록
      </button>
    </div>
  );
}

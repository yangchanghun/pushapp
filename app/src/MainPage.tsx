import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => {
          navigate("/1");
        }}
      >
        경비원실로
      </button>
      <button
        onClick={() => {
          navigate("/visitor/register");
        }}
      >
        방문등록
      </button>
    </div>
  );
}

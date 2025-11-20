import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const apiBase = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await axios.post(`${apiBase}/api/account/login/`, {
        username: form.username,
        password: form.password,
      });

      // 🔥 토큰 저장
      localStorage.setItem("token", res.data.token);

      navigate("/admin"); // 관리자 페이지로 이동
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrorMsg(err.response?.data?.error || "로그인 실패");
      } else {
        setErrorMsg("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          로그인
        </h2>

        <div className="space-y-4">
          <input
            name="username"
            type="text"
            placeholder="아이디"
            onChange={handleChange}
            value={form.username}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            onChange={handleChange}
            value={form.password}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        {errorMsg && (
          <p className="text-red-600 text-center mt-4">{errorMsg}</p>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/admin/register")}
            className="text-blue-600 hover:underline"
          >
            회원가입 하기 →
          </button>
        </div>
      </form>
    </div>
  );
}

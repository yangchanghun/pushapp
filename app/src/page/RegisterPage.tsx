import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const apiBase = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      await axios.post(`${apiBase}/api/account/register/`, form, {
        withCredentials: true,
      });

      setMsg("회원가입 완료! 로그인 페이지로 이동합니다.");

      // 1초 후 로그인 페이지로 이동
      setTimeout(() => navigate("/admin/login"), 800);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(err);
        setMsg("회원가입 실패: " + (err.response?.data?.detail ?? ""));
      } else {
        setMsg("알 수 없는 오류가 발생했습니다.");
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
          회원가입
        </h2>

        <div className="space-y-4">
          <input
            name="username"
            placeholder="아이디"
            onChange={handleChange}
            value={form.username}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-400"
          />

          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            onChange={handleChange}
            value={form.password}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>

        {msg && (
          <p className="mt-4 text-center text-blue-600 font-medium">{msg}</p>
        )}

        {/* 로그인 페이지 이동 링크 */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/admin/login")}
            className="text-blue-600 hover:underline"
          >
            로그인하기 →
          </button>
        </div>
      </form>
    </div>
  );
}

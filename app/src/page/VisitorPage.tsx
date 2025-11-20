import { useState } from "react";
import axios from "axios";
import ProfessorModal from "../modal/ProfessorModal";
import sampleImage from "@/assets/sampleImage.jpg";
// const API_URL = "https://pushapp.kioedu.co.kr";
// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;
export default function VisitorForm() {
  const [img, setImg] = useState<string | undefined>(sampleImage);
  const [form, setForm] = useState({
    name: "",
    phonenumber: "",
    visit_purpose: "",
    professor: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [professorName, setProfessorName] = useState(""); // 표시용
  const [showModal, setShowModal] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await axios.post(`${API_URL}/api/visit/create/`, form);
      const { token, name } = response.data;
      setSuccessMsg(`${name}님의 방문이 등록되었습니다!`);
      console.log(`✅ Token: ${token}`, { name });
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("방문자 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setProfessorName("");
      setForm({
        name: "",
        phonenumber: "",
        visit_purpose: "",
        professor: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* ⬅️ 왼쪽 폼 */}
      <button
        onClick={() => (window.location.href = "/admin/")}
        className="
          absolute top-5 right-5 
          bg-gray-800 text-white px-4 py-2 
          rounded-lg shadow-md 
          hover:bg-gray-700 transition
        "
      >
        관리자페이지
      </button>
      <div className="flex w-1/2 items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            방문자 등록
          </h2>

          {/* 이름, 전화번호, 방문 목적 */}
          <div className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="이름"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              name="phonenumber"
              value={form.phonenumber}
              onChange={handleChange}
              placeholder="전화번호"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              name="visit_purpose"
              value={form.visit_purpose}
              onChange={handleChange}
              placeholder="방문 목적"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* 교수 찾기 */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 px-4 py-3 border rounded-lg">
              {professorName || "교수를 선택하세요"}
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              찾기
            </button>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "등록 중..." : "등록하기"}
          </button>

          {successMsg && (
            <p className="mt-4 text-green-600 text-center font-medium">
              {successMsg}
            </p>
          )}
          {errorMsg && (
            <p className="mt-4 text-red-600 text-center font-medium">
              {errorMsg}
            </p>
          )}
        </form>
      </div>

      {/* ➡️ 오른쪽 이미지 (꽉 차게, 비율 유지) */}
      <div className="w-1/2 h-screen bg-black flex items-center justify-center">
        {img ? (
          <img
            src={img}
            alt="교수 위치 안내 이미지"
            className="w-full object-contain bg-black"
          />
        ) : (
          <p className="text-gray-400 text-lg">
            교수 선택 시 위치 안내 GIF 표시
          </p>
        )}
      </div>

      {/* 교수 선택 모달 */}
      {showModal && (
        <ProfessorModal
          setImg={setImg}
          onClose={() => setShowModal(false)}
          onSelect={(prof) => {
            setProfessorName(prof.name);
            setForm({ ...form, professor: String(prof.id) });
          }}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";
import ProfessorModal from "../modal/ProfessorModal";
import sampleImage from "@/assets/sampleImage.jpg";
import qrcodeImage from "@/assets/qrcode.png";
const API_URL = "https://pushapp.kioedu.co.kr";
// const API_URL = import.meta.env.VITE_API_URL;

export default function VisitorForm() {
  const [successModal, setSuccessModal] = useState(false);
  const [img, setImg] = useState<string | undefined>(sampleImage);
  // const [form, setForm] = useState({
  //   name: "",
  //   phonenumber: "",
  //   visit_purpose: "",
  //   professor: "",
  // });
  const [form, setForm] = useState({
    name: "",
    phonenumber: "",
    visit_purpose: "",
    professor: "",
    birth_year: "",
    birth_month: "",
    birth_day: "",
    car_number: "",
    company_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [professorName, setProfessorName] = useState(""); // 표시용
  const [showModal, setShowModal] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name: fieldName, value: rawValue } = e.target;

    let value = rawValue;

    // 🔥 전화번호만 숫자만 허용
    if (fieldName === "phonenumber") {
      value = value.replace(/[^0-9]/g, "");
    }

    setForm({ ...form, [fieldName]: value });
  };

  // const [agree, setAgree] = useState(false);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!form.professor) {
  //     setErrorMsg("교수를 선택해주세요.");
  //     return;
  //   }
  //   setLoading(true);
  //   setSuccessMsg("");
  //   setErrorMsg("");

  //   try {
  //     const response = await axios.post(`${API_URL}/api/visit/create/`, form);
  //     const { token, name } = response.data;
  //     setSuccessMsg(`${name}님의 방문이 등록되었습니다!`);
  //     console.log(`✅ Token: ${token}`, { name });
  //     setSuccessModal(true);
  //   } catch (err: unknown) {
  //     console.error(err);
  //     setErrorMsg("방문자 등록 중 오류가 발생했습니다.");
  //   } finally {
  //     setLoading(false);
  //     setProfessorName("");
  //     setForm({
  //       name: "",
  //       phonenumber: "",
  //       visit_purpose: "",
  //       professor: "",
  //     });
  //   }
  // };

  const [agreeModal, setAgreeModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.professor) {
      setErrorMsg("교수를 선택해주세요.");
      return;
    }
    // 🔥 서버요청 금지, 동의 모달 열기
    setAgreeModal(true);
  };

  const submitWithAgreement = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const birthdate = `${form.birth_year}-${String(form.birth_month).padStart(
        2,
        "0"
      )}-${String(form.birth_day).padStart(2, "0")}`;

      const response = await axios.post(`${API_URL}/api/visit/create/`, {
        ...form,
        is_agreed: true,
        birthdate, // 🔥 합친 날짜 전송
      });

      const { token, name } = response.data;
      setSuccessMsg(`${name}님의 방문이 등록되었습니다!`);
      setSuccessModal(true);
      console.log(`🟢 Token: ${token}`);
    } catch (err) {
      console.error(err);
      setErrorMsg("방문자 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setAgreeModal(false);
      setProfessorName("");
      setForm({
        name: "",
        phonenumber: "",
        visit_purpose: "",
        professor: "",
        birth_year: "",
        birth_month: "",
        birth_day: "",
        car_number: "",
        company_name: "",
      });
    }
  };

  return (
    // <div className="min-h-screen flex relative">
    <div className="min-h-screen flex flex-col md:flex-row relative">
      <img
        src={qrcodeImage}
        className="
    hidden md:block               <!-- ⭐ 모바일 숨김 -->
    absolute top-5 left w-24 h-24
    bg-white p-2 rounded-lg shadow-lg
  "
      />
      {/* ⬅️ 왼쪽 폼 */}
      {/* <button
        onClick={() => (window.location.href = "/admin/")}
        className="
    hidden md:block               <!-- ⭐ 모바일 숨김 -->
    absolute top-5 right-5 
    bg-gray-800 text-white px-4 py-2 
    rounded-lg shadow-md 
    hover:bg-gray-700 transition
  "
      >
        관리자페이지
      </button> */}
      {/* <div className="flex w-1/2 items-center justify-center"> */}
      <div className="flex md:w-1/2 w-full items-center justify-center">
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
              type="tel"
              inputMode="numeric"
              name="phonenumber"
              value={form.phonenumber}
              onChange={handleChange}
              placeholder="전화번호"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <div className="flex items-center gap-2">
              {/* Year */}
              <span className="whitespace-nowrap font-medium">생년월일:</span>
              <select
                name="birth_year"
                value={form.birth_year}
                onChange={handleChange}
                className="w-1/3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-white"
                required
              >
                <option value="" disabled>
                  연도
                </option>
                {Array.from({ length: 100 }, (_, i) => 2025 - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {/* Month */}
              <select
                name="birth_month"
                value={form.birth_month}
                onChange={handleChange}
                className="w-1/3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-white"
                required
              >
                <option value="" disabled>
                  월
                </option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              {/* Day */}
              <select
                name="birth_day"
                value={form.birth_day}
                onChange={handleChange}
                className="w-1/3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-white"
                required
              >
                <option value="" disabled>
                  일
                </option>
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <input
              name="car_number"
              value={form.car_number}
              onChange={handleChange}
              placeholder="차량번호"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <select
              name="visit_purpose"
              value={form.visit_purpose}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-white"
              required
            >
              <option value="" disabled>
                방문 목적을 선택해주세요
              </option>

              <option value="상담">상담</option>
              <option value="면담">면담</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <input
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            placeholder="회사명"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />

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
      {/* <div className="w-1/2 h-screen bg-black flex items-center justify-center"> */}
      <div className="md:w-1/2 w-full h-[50vh] md:h-screen bg-black flex items-center justify-center">
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
      {successModal && (
        <SuccessModal
          onClose={() => setSuccessModal(false)}
          message={successMsg}
        />
      )}

      {agreeModal && (
        <AgreeModal
          onClose={() => setAgreeModal(false)}
          onAgree={submitWithAgreement}
        />
      )}
    </div>
  );
}
interface SuccessModalProps {
  onClose: () => void;
  message: string;
  duration?: number; // 자동 닫힘 시간(ms)
}

const SuccessModal = ({
  onClose,
  message,
  duration = 3000,
}: SuccessModalProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="
        fixed inset-0 bg-black/40 backdrop-blur-sm
        flex items-center justify-center z-50
      "
    >
      <div
        className="
          bg-white w-80 p-6 rounded-2xl shadow-2xl
          animate-[zoomIn_0.2s_ease-out]
        "
      >
        <h2 className="text-center text-2xl font-bold text-green-600 mb-3">
          등록 완료!
        </h2>

        <p className="text-center text-gray-700 mb-2 whitespace-pre-line">
          {message}
        </p>

        <p className="text-center text-gray-400 text-sm">
          잠시 후 자동으로 닫힙니다...
        </p>
      </div>
    </div>
  );
};

const AgreeModal = ({
  onClose,
  onAgree,
}: {
  onClose: () => void;
  onAgree: () => void;
}) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 w-96 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-center">
          개인정보 처리 동의
        </h2>

        <div className="text-gray-700 text-sm mb-4 h-40 overflow-auto border p-3 rounded">
          방문자 등록을 위해 이름, 전화번호, 방문목적, 담당교수 정보가
          수집됩니다. 해당 정보는 방문 확인 및 보안 절차를 위해 사용됩니다.
          방문자 등록을 위해 이름, 전화번호, 방문목적, 담당교수 정보가
          수집됩니다. 해당 정보는 방문 확인 및 보안 절차를 위해 사용됩니다.
          방문자 등록을 위해 이름, 전화번호, 방문목적, 담당교수 정보가
          수집됩니다. 해당 정보는 방문 확인 및 보안 절차를 위해 사용됩니다.
          방문자 등록을 위해 이름, 전화번호, 방문목적, 담당교수 정보가
          수집됩니다. 해당 정보는 방문 확인 및 보안 절차를 위해 사용됩니다.
        </div>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            className="w-5 h-5"
          />
          <span className="text-gray-700 text-sm">
            개인정보 처리에 동의합니다.
          </span>
        </label>

        <button
          disabled={!checked}
          onClick={onAgree}
          className={`w-full py-3 rounded-lg font-bold text-white transition ${
            checked ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"
          }`}
        >
          동의하고 제출하기
        </button>

        <button
          onClick={onClose}
          className="mt-3 w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
        >
          취소
        </button>
      </div>
    </div>
  );
};

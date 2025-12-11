import { useState, useEffect } from "react";
import axios from "axios";
import ProfessorModal from "../modal/ProfessorModal";
import sampleImage from "@/assets/sampleImage.jpg";
import qrcodeImage from "@/assets/qrcode.png";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
const API_URL = "https://pushapp.kioedu.co.kr";
// const API_URL = import.meta.env.VITE_API_URL;

export default function VisitorForm() {
  const [successModal, setSuccessModal] = useState(false);
  const [location, setLocation] = useState("");
  console.log(location);
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
  const [showImageModal, setShowImageModal] = useState(false);
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
            <input
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              placeholder="회사명"
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
      {/* <div className="w-1/2 h-screen bg-black flex items-center justify-center"> */}
      <div className="md:w-1/2 w-full h-[50vh] md:h-screen bg-black flex items-center justify-center">
        <div className="flex-col">
          <div className="text-center bg-black/50 text-white font-bold text-xl px-4 py-2 rounded-lg mb-3">
            {location && <div> 위치: {location}</div>}
          </div>

          {img ? (
            <>
              <img
                src={img}
                alt="교수 위치 안내 이미지"
                className="w-full object-contain bg-black"
              />
              <button
                onClick={() => img && setShowImageModal(true)}
                className="absolute bottom-5 right-5 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition"
                aria-label="이미지 전체 화면 보기"
                title="이미지 전체 화면 보기"
              >
                <span className="text-4xl">🔎</span>
              </button>
            </>
          ) : (
            <p className="text-gray-400 text-lg">
              교수 선택 시 위치 안내 GIF 표시
            </p>
          )}
        </div>
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
          setLocation={setLocation}
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
      {showImageModal && img && (
        <FullScreenImageModal
          imgSrc={img}
          onClose={() => setShowImageModal(false)}
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
      <div className="bg-white p-8 w-[90vw] max-w-3xl max-h-[70vh] rounded-2xl shadow-xl flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center">
          개인정보 처리 동의
        </h2>

        {/* 🔽 내용 영역: 스크롤 가능 */}
        <div className="text-gray-700 text-lg whitespace-pre-line leading-relaxed overflow-y-auto flex-1 pr-2">
          {`「연구원 방문자 개인정보 수집 및 이용 동의서」

본인은 연구원을 출입함에 있어 아래 내용을 충분히 확인하였으며,
개인정보 수집·이용 및 보안수칙 준수에 동의합니다.

■ 개인정보 수집·이용(개인정보보호법 제15조)
- 수집 목적: 방문증 발급, 출입기록 확인, 사고·도난·분실 발생 시 안내
- 수집 항목: 성명, 소속, 생년월일, 연락처, 차량정보, 출입기록
- 보유 기간: 동의일로부터 최대 5년
※ 동의를 거부할 수 있으나, 미동의 시 출입이 제한될 수 있습니다.

■ 보안 준수 사항
- 방문증을 항상 착용하고 분실되지 않도록 관리하며 타인에게 대여하지 않습니다.
- 연구원 시설·설비·장비를 임의로 조작하지 않습니다.
- 안전보건표지 및 모든 관련 규정을 준수합니다.
- 지정된 장소 외 흡연 및 화기 사용을 금합니다.
- 제한 또는 금지 구역에는 허가 없이 출입하지 않습니다.
- 출입 목적 외 정보 접근 및 취득 정보의 유출·공개를 금지합니다.`}
        </div>

        {/* 체크박스 */}
        <label className="flex items-center gap-3 mt-4 mb-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            className="w-6 h-6"
          />
          <span className="text-gray-700 text-lg">
            개인정보 처리에 동의합니다.
          </span>
        </label>

        {/* 버튼 영역 */}
        <div className="flex flex-col gap-3">
          <button
            disabled={!checked}
            onClick={onAgree}
            className={`w-full py-3.5 rounded-lg font-bold text-white text-lg transition ${
              checked ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"
            }`}
          >
            동의하고 제출하기
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 text-gray-500 hover:text-gray-700 text-lg"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

interface FullScreenImageModalProps {
  imgSrc: string;
  onClose: () => void;
}

const FullScreenImageModal = ({
  imgSrc,
  onClose,
}: FullScreenImageModalProps) => {
  const [countdown, setCountdown] = useState(30); // 30초 카운트다운

  useEffect(() => {
    // 1초마다 countdown -1
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // 30초 후 자동 닫기
    const timer = setTimeout(() => {
      onClose();
    }, 30000);

    // cleanup
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]">
      {/* 🔥 카운트다운 표시 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-xl font-semibold bg-black/50 px-4 py-1 rounded-lg">
        {/* 자동 종료까지: {countdown}초 */}
      </div>

      <div
        className="w-[90vw] max-w-screen-xl max-h-[90vh] p-4 flex flex-col items-center justify-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={3}
          wheel={{ disabled: true }}
          pinch={{ disabled: true }}
          doubleClick={{ disabled: true }}
        >
          {(utils) => (
            <>
              {/* 확대/축소 컨트롤 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex space-x-2 p-2 rounded-b-lg bg-black/40 text-white z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    utils.resetTransform();
                  }}
                  className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 rounded transition font-medium"
                  title="100% 크기로 초기화"
                >
                  100%
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    utils.zoomOut(0.5, 200);
                  }}
                  className="px-3 py-1 text-lg bg-gray-600 hover:bg-gray-700 rounded transition"
                >
                  -
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    utils.zoomIn(0.5, 200);
                  }}
                  className="px-3 py-1 text-lg bg-gray-600 hover:bg-gray-700 rounded transition"
                >
                  +
                </button>
              </div>

              <TransformComponent>
                <img
                  src={imgSrc}
                  alt="확대된 교수 위치 안내 이미지"
                  className="max-w-full max-h-full block"
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-4xl font-light p-2 rounded-full hover:bg-white/20 transition"
      >
        ✖️
      </button>
    </div>
  );
};

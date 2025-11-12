import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://pushapp.kioedu.co.kr";

interface Visitor {
  name: string;
  phonenumber: string;
  visit_purpose: string;
  status: string;
  created_at: string;
  professor_name?: string;
  token: string;
}

interface VisitorDetailModalProps {
  token: string;
  onClose: () => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setCheckedMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function VisitorDetailModal({
  token,
  onClose,
  setMessages,
  setCheckedMessages,
}: VisitorDetailModalProps) {
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ✅ 방문자 상세조회
  useEffect(() => {
    axios
      .get(`${API_URL}/api/visit/detail/${token}/`)
      .then((res) => setVisitor(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  // ✅ 확인 버튼
  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      const res = await axios.post(`${API_URL}/api/visit/check/`, { token });
      alert(res.data.message || "확인 완료!");

      // ✅ 왼쪽(no_checked)에서 제거
      setMessages((prev) => prev.filter((msg) => msg.token !== token));

      // ✅ 오른쪽(checked)에 추가
      if (visitor) {
        const newChecked = {
          sender: visitor.professor_name || "교수",
          visitor: visitor.name,
          text: `을 ${visitor.status}했습니다.`,
          token: visitor.token,
        };
        setCheckedMessages((prev) => [...prev, newChecked]);
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg">불러오는 중...</div>
      </div>
    );

  if (!visitor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          방문자 상세정보
        </h2>

        <div className="space-y-3 text-gray-700">
          <p>
            <strong>이름:</strong> {visitor.name}
          </p>
          <p>
            <strong>전화번호:</strong> {visitor.phonenumber}
          </p>
          <p>
            <strong>방문 목적:</strong> {visitor.visit_purpose}
          </p>
          <p>
            <strong>상태:</strong> {visitor.status}
          </p>
          <p>
            <strong>등록일:</strong>{" "}
            {new Date(visitor.created_at).toLocaleString()}
          </p>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className={`px-4 py-2 rounded-lg text-white ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "처리 중..." : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}

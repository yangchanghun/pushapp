import { useState } from "react";
import axios from "axios";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RegisterProfessorModal({ onClose, onSuccess }: Props) {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    phonenumber: "",
    location: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 🔥 전화번호는 숫자만 허용
    const newValue =
      name === "phonenumber" ? value.replace(/[^0-9]/g, "") : value;

    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phonenumber || !form.location) {
      alert("모든 필드를 입력해주세요!");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phonenumber", form.phonenumber);
    formData.append("location", form.location);

    if (file) formData.append("location_gif", file);

    try {
      await axios.post(`${API_URL}/api/professors/create/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      alert("교수 등록 완료!");
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      alert("등록 실패! 관리자 권한이 필요합니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-96 shadow-xl relative">
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-6 text-center">교수 등록</h2>

        {/* 입력 폼 */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <input
            type="text"
            name="phonenumber"
            placeholder="전화번호"
            value={form.phonenumber}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <input
            type="text"
            name="location"
            placeholder="위치 (예: 301호)"
            value={form.location}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          {/* GIF 업로드 */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="border rounded-lg p-2"
          />
        </div>

        {/* 버튼들 */}
        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          등록하기
        </button>
      </div>
    </div>
  );
}

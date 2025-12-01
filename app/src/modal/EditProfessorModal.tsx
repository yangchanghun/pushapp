import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  id: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProfessorModal({ id, onClose, onSuccess }: Props) {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    phonenumber: "",
    location: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/professors/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setForm({
          name: res.data.name,
          phonenumber: res.data.phonenumber,
          location: res.data.location,
        });
      });
  }, [id]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phonenumber", form.phonenumber);
    formData.append("location", form.location);
    if (file) formData.append("location_gif", file);

    await axios.patch(`${API_URL}/api/professors/${id}/update/`, formData, {
      headers: { Authorization: `Token ${token}` },
    });

    alert("수정 완료!");
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-96 shadow-xl relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center mb-6">교수 정보 수정</h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
            className="border rounded p-2"
            placeholder="이름"
          />

          <input
            type="text"
            name="phonenumber"
            value={form.phonenumber}
            onChange={(e) => {
              const onlyNum = e.target.value.replace(/[^0-9]/g, "");
              setForm({ ...form, phonenumber: onlyNum });
            }}
            className="border rounded p-2"
            placeholder="전화번호"
          />

          <input
            type="text"
            name="location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
            className="border rounded p-2"
            placeholder="위치"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="border rounded p-2"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          수정하기
        </button>
      </div>
    </div>
  );
}

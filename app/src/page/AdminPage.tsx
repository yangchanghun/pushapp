import { useEffect, useState } from "react";
import axios from "axios";
import RegisterProfessorModal from "../modal/RegisterProfessorModal";
import EditProfessorModal from "../modal/EditProfessorModal";
interface Professor {
  id: number;
  name: string;
  phonenumber: string;
  location: string;
  location_gif?: string | null;
}
export default function AdminPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [professors, setProfessors] = useState<Professor[]>([]);
  const [search, setSearch] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const loadProfessors = () => {
    axios
      .get(`${API_URL}/api/professors/list/?search=${search}`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setProfessors(res.data);
      });
  };

  useEffect(() => {
    loadProfessors();
  }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    await axios.delete(`${API_URL}/api/professors/${id}/delete/`, {
      headers: { Authorization: `Token ${token}` },
    });

    loadProfessors();
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📚 담당자 관리</h1>

      {/* 검색 */}
      <input
        type="text"
        placeholder="이름 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* 등록 버튼 */}
      <button
        onClick={() => setRegisterOpen(true)}
        className="mb-5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        + 담당자 등록
      </button>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow p-4 border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 text-left">ID</th>
              <th className="py-3 text-left">이름</th>
              <th className="py-3 text-left">전화번호</th>
              <th className="py-3 text-left">위치</th>
              <th className="py-3 text-center">관리</th>
            </tr>
          </thead>

          <tbody>
            {professors.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-100">
                <td className="py-2">{p.id}</td>
                <td className="py-2">{p.name}</td>
                <td className="py-2">{p.phonenumber}</td>
                <td className="py-2">{p.location}</td>

                <td className="py-2 text-center">
                  <button
                    onClick={() => setEditId(p.id)}
                    className="text-blue-600 hover:underline mx-2"
                  >
                    수정
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:underline mx-2"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 등록 모달 */}
      {registerOpen && (
        <RegisterProfessorModal
          onClose={() => setRegisterOpen(false)}
          onSuccess={loadProfessors}
        />
      )}

      {/* 수정 모달 */}
      {editId && (
        <EditProfessorModal
          id={editId}
          onClose={() => setEditId(null)}
          onSuccess={loadProfessors}
        />
      )}
    </div>
  );
}

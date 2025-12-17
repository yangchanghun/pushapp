import { useEffect, useState } from "react";
import axios from "axios";
import RegisterProfessorModal from "../modal/RegisterProfessorModal";
import EditProfessorModal from "../modal/EditProfessorModal";
import { useNavigate } from "react-router-dom";
interface Professor {
  id: number;
  name: string;
  phonenumber: string;
  location: string;
  location_gif?: string | null;
  department?: string;
}
export default function AdminPage() {
  const API_URL = "https://pushapp.kioedu.co.kr";
  // const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const [page, setPage] = useState(1);
  const pageSize = 10;
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
        setPage(1); // 검색 시 페이지 초기화
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
  const navigate = useNavigate();

  const totalPages = Math.ceil(professors.length / pageSize);

  const paginatedProfessors = professors.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (page > 3) pages.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="flex  items-center mb-6">
        <h1 className="text-white text-3xl font-bold">담당자 관리</h1>
        <button
          onClick={() => {
            navigate("/admin/visitors/list");
          }}
        >
          방문자 관리
        </button>
      </div>

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
              <th className="py-3 text-center">부서</th>
              <th className="py-3 text-center">관리</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProfessors.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-100">
                <td className="py-2">{p.id}</td>
                <td className="py-2">{p.name}</td>
                <td className="py-2">{p.phonenumber}</td>
                <td className="py-2">{p.location}</td>
                <td className="py-2">{p.department}</td>

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

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            이전
          </button>

          {getPageNumbers().map((p, idx) =>
            p === "..." ? (
              <span key={idx} className="px-2">
                ...
              </span>
            ) : (
              <button
                key={idx}
                onClick={() => setPage(p as number)}
                className={`px-3 py-1 border rounded ${
                  page === p ? "bg-blue-600 text-white" : ""
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}

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

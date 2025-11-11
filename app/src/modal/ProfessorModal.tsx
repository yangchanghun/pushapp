import { useEffect, useState } from "react";
import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = "https://pushapp.kioedu.co.kr";

interface Professor {
  id: number;
  name: string;
  phonenumber: string;
  location: string;
  location_gif?: string;
}

interface ProfessorModalProps {
  onClose: () => void;
  onSelect: (professor: Professor) => void;
}

export default function ProfessorModal({
  onClose,
  onSelect,
}: ProfessorModalProps) {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지당 10명

  useEffect(() => {
    axios
      .get(`${API_URL}/api/professors/list/`)
      .then((res: { data: Professor[] }) => {
        setProfessors(res.data);
        setFiltered(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔍 실시간 검색
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(professors);
    } else {
      const lower = search.toLowerCase();
      const result = professors.filter((p) =>
        p.name.toLowerCase().includes(lower)
      );
      setFiltered(result);
      setCurrentPage(1); // 검색 시 1페이지로 리셋
    }
  }, [search, professors]);

  // ✅ 페이지네이션 계산
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">교수 찾기</h2>

        <input
          type="text"
          placeholder="이름으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        {loading ? (
          <p className="text-center text-gray-500 py-4">불러오는 중...</p>
        ) : currentItems.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            검색 결과가 없습니다.
          </p>
        ) : (
          <>
            <div className="max-h-80 overflow-y-auto divide-y">
              {currentItems.map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => {
                    onSelect(prof);
                    onClose();
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 transition"
                >
                  <div className="font-semibold text-gray-800">{prof.name}</div>
                  <div className="text-sm text-gray-500">
                    {prof.phonenumber} · {prof.location}
                  </div>
                </button>
              ))}
            </div>

            {/* ✅ 페이지네이션 버튼 영역 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === 1
                      ? "text-gray-400 border-gray-200"
                      : "text-gray-700 hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  이전
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-md border ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white border-blue-500"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === totalPages
                      ? "text-gray-400 border-gray-200"
                      : "text-gray-700 hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

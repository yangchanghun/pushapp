import { useEffect, useState } from "react";
import axios from "axios";

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
  setImg: (url: string | undefined) => void;
  setLocation: (location: string) => void;
}

export default function ProfessorModal({
  setImg,
  onClose,
  onSelect,
  setLocation,
}: ProfessorModalProps) {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(`${API_URL}/api/professors/list/`)
      .then((res: { data: Professor[] }) => {
        setProfessors(res.data);
        setFiltered(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔍 검색
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(professors);
    } else {
      const lower = search.toLowerCase();
      setFiltered(
        professors.filter((p) => p.name.toLowerCase().includes(lower))
      );
      setCurrentPage(1);
    }
  }, [search, professors]);

  // 페이지 계산
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  // ✅ 슬라이딩 페이지네이션 계산
  const maxPageButtons = 5;

  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));

  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative">
        <h2 className="text-xl font-semibold mb-4">교수 찾기</h2>

        <input
          type="text"
          placeholder="이름으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        {loading ? (
          <p className="text-center py-4 text-gray-500">불러오는 중...</p>
        ) : currentItems.length === 0 ? (
          <p className="text-center py-4 text-gray-500">
            검색 결과가 없습니다.
          </p>
        ) : (
          <>
            <div className="max-h-80 overflow-y-auto divide-y">
              {currentItems.map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => {
                    setImg(prof.location_gif);
                    setLocation(prof.location);
                    onSelect(prof);
                    onClose();
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50"
                >
                  <div className="font-semibold">{prof.name}</div>
                  <div className="text-sm text-gray-500">
                    {prof.phonenumber} · {prof.location}
                  </div>
                </button>
              ))}
            </div>

            {/* ✅ 슬라이딩 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                {/* 이전 */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 border rounded disabled:text-gray-400"
                >
                  이전
                </button>

                {/* 첫 페이지 */}
                {startPage > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentPage(1)}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      1
                    </button>
                    <span className="px-2">...</span>
                  </>
                )}

                {/* 가운데 페이지들 */}
                {visiblePages.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded ${
                      page === currentPage
                        ? "bg-blue-500 text-white border-blue-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* 마지막 페이지 */}
                {endPage < totalPages && (
                  <>
                    <span className="px-2">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                {/* 다음 */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:text-gray-400"
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

import { useState } from "react";
import { useVisitors } from "../hooks/useVisitors";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";

export default function AdminVisitorListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, count, loading } = useVisitors(search, status, page);

  // 🔥 엑셀 다운로드 URL
  const excelURL = `${
    import.meta.env.VITE_API_URL
  }/api/visit/excel/?search=${search}&status=${status}`;
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex  items-center mb-6">
        <h1 className="text-white text-3xl font-bold ">방문자 관리</h1>
        <button
          onClick={() => {
            navigate("/admin/professors/list");
          }}
        >
          담당자 관리
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="이름 / 전화번호 / 목적 검색"
          className="border rounded px-4 py-2 flex-1"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="border rounded px-4 py-2"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">전체 상태</option>
          <option value="대기">대기</option>
          <option value="수락">수락</option>
          <option value="거절">거절</option>
        </select>

        {/* Excel 버튼 */}
        <a href={excelURL} download>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            엑셀 다운로드
          </button>
        </a>
      </div>

      {/* 테이블 */}
      <div className="bg-white shadow rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">이름</th>
              <th className="p-3 border">전화번호</th>
              <th className="p-3 border">방문 목적</th>
              <th className="p-3 border">상태</th>
              <th className="p-3 border">생성 날짜</th>
              <th className="p-3 border">체크 여부</th>
              <th className="p-3 border">담당 교수</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  로딩중...
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  데이터가 없습니다.
                </td>
              </tr>
            )}

            {!loading &&
              data.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{v.name}</td>
                  <td className="p-3 border">{v.phonenumber}</td>
                  <td className="p-3 border">{v.visit_purpose}</td>
                  <td className="p-3 border">{v.status}</td>
                  <td className="p-3 border">
                    {new Date(v.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 border">
                    {v.is_checked ? "✔ 체크됨" : "❌ 미체크"}
                  </td>
                  <td className="p-3 border">{v.professor_name}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <Pagination page={page} setPage={setPage} total={count} />
    </div>
  );
}

import { useState, useEffect } from "react";
import { useVisitors } from "../hooks/useVisitors";
import Pagination from "../components/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import useVisitSocket from "../hooks/useVisitSocket";
import acceptSound from "@/assets/voice/accept.mp3";
import { setSoundEnabled } from "../utils/PlaySound";

export default function AdminVisitorListPage() {
  const [newVisitorIds, setNewVisitorIds] = useState<Set<number>>(new Set());
  const [statusChangedIds, setStatusChangedIds] = useState<Set<number>>(
    new Set()
  );
  useEffect(() => {
    const audio = new Audio(acceptSound);

    audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        console.log("🔓 Audio unlocked");
      })
      .catch((err) => {
        console.warn("🔇 Audio locked:", err);
      });
  }, []);

  const [soundOn, setSoundOn] = useState(false);
  const handleToggleSound = () => {
    if (!soundOn) {
      const audio = new Audio(acceptSound);
      audio.volume = 0; // 🔇 무음으로 unlock
      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 1; // 다시 원래 볼륨
          console.log("🔓 Audio unlocked (silent)");
        })
        .catch(console.warn);
    }

    setSoundOn((prev) => {
      setSoundEnabled(!prev);
      return !prev;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const yy = String(date.getFullYear()).slice(2); // 2025 → 25
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0"); // 24시간
    const min = String(date.getMinutes()).padStart(2, "0");

    return `${yy}.${mm}.${dd} ${hh}:${min}`;
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const apiBase = "https://pushapp.kioedu.co.kr";
  const apiHost = apiBase.replace(/^https?:\/\//, "");
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  const userId = "1";
  // useVisitSocket({
  //   userId,
  //   apiHost,
  //   wsProtocol,
  // });

  // useVisitSocket({
  //   userId,
  //   apiHost,
  //   wsProtocol,
  //   onVisitorCreated: (visitor) => {
  //     // 🔍 현재 필터 조건 체크
  //     if (status && visitor.status !== status) return;

  //     if (
  //       search &&
  //       !(
  //         visitor.name.includes(search) ||
  //         visitor.phonenumber.includes(search) ||
  //         visitor.visit_purpose.includes(search)
  //       )
  //     ) {
  //       return;
  //     }

  //     // ✅ 중복 방지 + 실시간 prepend
  //     setData((prev) => {
  //       if (prev.some((v) => v.id === visitor.id)) return prev;
  //       return [visitor, ...prev];
  //     });
  //   },
  //   onVisitorStatusUpdated: (token, newStatus) => {
  //     setData((prev) =>
  //       prev.map((v) => (v.token === token ? { ...v, status: newStatus } : v))
  //     );
  //   },
  // });
  useVisitSocket({
    userId,
    apiHost,
    wsProtocol,

    onVisitorCreated: (visitor) => {
      // 🔴 새 방문자 표시
      setNewVisitorIds((prev) => {
        const next = new Set(prev);
        next.add(visitor.id);
        return next;
      });

      // 5초 후 빨간 점 제거
      setTimeout(() => {
        setNewVisitorIds((prev) => {
          const next = new Set(prev);
          next.delete(visitor.id);
          return next;
        });
      }, 120000);

      // 기존 데이터 추가
      setData((prev) => {
        if (prev.some((v) => v.id === visitor.id)) return prev;
        return [visitor, ...prev];
      });
    },

    onVisitorStatusUpdated: (token, newStatus) => {
      setData((prev) =>
        prev.map((v) => (v.token === token ? { ...v, status: newStatus } : v))
      );

      const target = data.find((v) => v.token === token);
      if (target) {
        setStatusChangedIds((prev) => {
          const next = new Set(prev);
          next.add(target.id);
          return next;
        });

        // 5초 후 무지개 제거
        setTimeout(() => {
          setStatusChangedIds((prev) => {
            const next = new Set(prev);
            next.delete(target.id);
            return next;
          });
        }, 120000);
      }
    },
  });

  // URL에서 값 읽기
  let initialPage = Number(searchParams.get("page")) || 1;
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "";
  if (!initialPage || isNaN(initialPage) || initialPage < 1) {
    initialPage = 1;
  }
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    const params: Record<string, string> = {};

    if (page > 1) params.page = String(page);
    if (search) params.search = search;
    if (status) params.status = status;

    setSearchParams(params);
  }, [page, search, status, setSearchParams]);

  // 데이터 가져오기
  const { data, count, loading, setData } = useVisitors(search, status, page);

  const excelURL = `${
    // import.meta.env.VITE_API_URL
    "https://pushapp.kioedu.co.kr"
  }/api/visit/excel/?search=${search}&status=${status}&page=${page}`;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-white text-3xl font-bold">방문자 관리</h1>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-white text-sm">
            {soundOn ? "🔊 알림 ON" : "🔇 알림 OFF"}
          </span>

          <div className="relative">
            <input
              type="checkbox"
              checked={soundOn}
              onChange={handleToggleSound}
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full transition ${
                soundOn ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                soundOn ? "translate-x-5" : ""
              }`}
            />
          </div>
        </label>
        <button onClick={() => navigate("/admin/professors/list")}>
          담당자 관리
        </button>
      </div>

      {/* 검색 / 필터 */}
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
              <th className="p-3 border">방문 날짜</th>
              <th className="p-3 border">회사명</th>
              <th className="p-3 border">생년월일</th>
              <th className="p-3 border">차량번호</th>
              <th className="p-3 border">담당자</th>
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
                  {/* <td className="p-3 border">{v.name}</td>
                   */}
                  <td className="p-3 border relative">
                    {statusChangedIds.has(v.id) ? (
                      <StatusDot color="rainbow" />
                    ) : newVisitorIds.has(v.id) ? (
                      <StatusDot color="red" />
                    ) : null}

                    {v.name}
                  </td>
                  <td className="p-3 border">{v.phonenumber}</td>
                  <td className="p-3 border">{v.visit_purpose}</td>
                  {/* <td className="p-3 border">
                    {v.status === "수락" && (
                      <p style={{ color: "blue" }}>수락</p>
                    )}
                    {v.status === "거절" && (
                      <p style={{ color: "red" }}>거절</p>
                    )}
                    {v.status === "대기" && <p>대기</p>}
                  </td> */}
                  <td className="p-3 border font-bold">
                    <span
                      className={
                        statusChangedIds.has(v.id)
                          ? "animate-rainbow"
                          : v.status === "수락"
                          ? "text-blue-600"
                          : v.status === "거절"
                          ? "text-red-600"
                          : "text-gray-700"
                      }
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="p-3 border">{formatDate(v.created_at)}</td>
                  <td className="p-3 border">{v.company_name}</td>
                  <td className="p-3 border">{v.birthdate}</td>
                  <td className="p-3 border">{v.car_number}</td>
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

function StatusDot({ color }: { color: "red" | "rainbow" }) {
  return (
    <span className="absolute left-[-20px] top-1/2 -translate-y-1/2">
      <span className="relative flex h-3 w-3">
        {/* 바깥 퍼짐 */}
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
            color === "red" ? "bg-red-400 animate-ping" : "animate-rainbow-bg"
          }`}
        />
        {/* 중심 점 */}
        <span
          className={`relative inline-flex h-3 w-3 rounded-full ${
            color === "red" ? "bg-red-600" : "animate-rainbow-bg"
          }`}
        />
      </span>
    </span>
  );
}

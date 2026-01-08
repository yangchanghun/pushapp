// import { useSearchParams, useNavigate } from "react-router-dom";
// import Pagination from "../components/Pagination";
// import { useVisitorsQuery } from "./useVisitQuery";

// export interface Visitor {
//   id: number;
//   name: string;
//   phonenumber: string;
//   visit_purpose: string;
//   status: string;
//   created_at: string;
//   is_checked: boolean;
//   professor_name: string;
//   car_number: string;
//   company_name: string;
//   birthdate: string;
//   token: string;
// }
// const formatDate = (dateString: string) => {
//   const date = new Date(dateString);
//   const yy = String(date.getFullYear()).slice(2);
//   const mm = String(date.getMonth() + 1).padStart(2, "0");
//   const dd = String(date.getDate()).padStart(2, "0");
//   const hh = String(date.getHours()).padStart(2, "0");
//   const min = String(date.getMinutes()).padStart(2, "0");
//   return `${yy}.${mm}.${dd} ${hh}:${min}`;
// };

// export default function TestVisitListView() {
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();

//   // 🔹 URL → 상태 (단일 소스)
//   const page = Number(searchParams.get("page")) || 1;
//   const search = searchParams.get("search") || "";
//   const status = searchParams.get("status") || "";
//   const startDate = searchParams.get("start_date") || "";
//   const endDate = searchParams.get("end_date") || "";

//   // 🔹 데이터 패칭
//   const { data, isLoading, isFetching } = useVisitorsQuery(
//     search,
//     status,
//     page,
//     startDate,
//     endDate
//   );

//   const count = data?.count ?? 0;
//   const results = data?.results ?? [];

//   // 🔹 URL 업데이트 헬퍼
//   const updateParams = (next: Record<string, string | number>) => {
//     const params = new URLSearchParams(searchParams);
//     Object.entries(next).forEach(([k, v]) => {
//       if (!v) params.delete(k);
//       else params.set(k, String(v));
//     });
//     setSearchParams(params);
//   };

//   if (isLoading) {
//     return <div className="p-8 text-center">최초 로딩중...</div>;
//   }

//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       {/* 헤더 */}
//       <div className="flex items-center mb-6 justify-between">
//         <h1 className="text-3xl font-bold text-white">방문자 관리</h1>
//         <button onClick={() => navigate("/admin/professors/list")}>
//           담당자 관리
//         </button>
//       </div>

//       {/* 🔹 필터
//       <div className="flex gap-4 mb-6">
//         <input
//           placeholder="검색"
//           value={search}
//           onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
//           className="border px-4 py-2 flex-1"
//         />

//         <select
//           value={status}
//           onChange={(e) => updateParams({ status: e.target.value, page: 1 })}
//           className="border px-4 py-2"
//         >
//           <option value="">전체</option>
//           <option value="대기">대기</option>
//           <option value="수락">수락</option>
//           <option value="거절">거절</option>
//         </select>
//       </div> */}
//       <div className="flex gap-4 mb-6">
//         <input
//           placeholder="검색"
//           value={search}
//           onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
//           className="border px-4 py-2 flex-1"
//         />

//         <select
//           value={status}
//           onChange={(e) => updateParams({ status: e.target.value, page: 1 })}
//           className="border px-4 py-2"
//         >
//           <option value="">전체</option>
//           <option value="대기">대기</option>
//           <option value="수락">수락</option>
//           <option value="거절">거절</option>
//         </select>

//         {/* 🔥 시작 날짜 */}
//         <input
//           type="date"
//           value={startDate}
//           onChange={(e) =>
//             updateParams({ start_date: e.target.value, page: 1 })
//           }
//           className="border px-3 py-2"
//         />

//         <span>~</span>

//         {/* 🔥 종료 날짜 */}
//         <input
//           type="date"
//           value={endDate}
//           onChange={(e) => updateParams({ end_date: e.target.value, page: 1 })}
//           className="border px-3 py-2"
//         />

//         <button
//           onClick={() =>
//             updateParams({
//               start_date: "",
//               end_date: "",
//               page: 1,
//             })
//           }
//           className="px-3 py-2 bg-gray-200 rounded"
//         >
//           날짜 초기화
//         </button>
//       </div>

//       {/* 🔹 fetch 중 표시 (깜빡임 ❌) */}
//       {isFetching && (
//         <div className="text-sm text-gray-500 mb-2">데이터 갱신 중...</div>
//       )}

//       {/* 🔹 테이블 */}
//       <div className="bg-white rounded shadow">
//         <table className="w-full border-collapse">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 border">이름</th>
//               <th className="p-3 border">전화번호</th>
//               <th className="p-3 border">상태</th>
//               <th className="p-3 border">방문 목적</th>
//             </tr>
//           </thead>
//           <tbody>
//             {results.length === 0 && (
//               <tr>
//                 <td colSpan={4} className="text-center py-6">
//                   데이터가 없습니다.
//                 </td>
//               </tr>
//             )}

//             {results.map((v: Visitor) => (
//               <tr key={v.id} className="hover:bg-gray-50">
//                 <td className="p-3 border">{v.name}</td>
//                 <td className="p-3 border">{v.phonenumber}</td>
//                 <td className="p-3 border">{v.status}</td>
//                 <td className="p-3 border">{v.visit_purpose}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* 🔹 페이지네이션 */}
//       <Pagination
//         page={page}
//         total={count}
//         setPage={(p) => updateParams({ page: p })}
//       />
//     </div>
//   );
// }

// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;
// // ✅ 초기 데이터 불러오기
// export const fetchInitial = async () => {
//   try {
//     const [noChecked, checked] = await Promise.all([
//       axios.get(`${API_URL}/api/visit/no_checked/`),
//       axios.get(`${API_URL}/api/visit/checked/`),
//     ]);

//     const pendingMessages: Message[] = noChecked.data.map((v: any) => ({
//       sender: v.professor_name || "없음",
//       visitor: v.name,
//       text:
//         (v.status === "수락" && "방문을 수락했습니다") ||
//         (v.status === "거절" && "방문을 거절했습니다"),
//       token: v.token,
//     }));

//     setMessages((prev) => {
//       // ✅ 이미 있는 토큰 중복 방지
//       const existingTokens = new Set(prev.map((m) => m.token));
//       const newOnes = pendingMessages.filter(
//         (m) => !existingTokens.has(m.token)
//       );
//       return [...prev, ...newOnes];
//     });

//     setCheckedVisitors(checked.data);
//     console.log("✅ 초기 방문자 불러오기 완료");
//   } catch (err) {
//     console.error("❌ 초기 데이터 불러오기 실패:", err);
//   }
// };

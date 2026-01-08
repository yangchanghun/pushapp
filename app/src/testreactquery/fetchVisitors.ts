export async function fetchVisitors(params: URLSearchParams) {
  const res = await fetch(
    `https://pushapp.kioedu.co.kr/api/visit/list/?${params}`
  );
  if (!res.ok) throw new Error("fetch error");
  return res.json();
}

// 필터로 받아야하는 게
//         "name",
// "phonenumber",
// "visit_purpose",
// "professor__name",

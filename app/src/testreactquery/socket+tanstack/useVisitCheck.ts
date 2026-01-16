import { useQuery } from "@tanstack/react-query";

async function checkVisitToken(token: string) {
  const res = await fetch(
    `https://pushapp.kioedu.co.kr/api/visit/check/${token}/`
  );

  if (!res.ok) throw new Error("Invalid token");
  return res.json();
}

export function useVisitCheck(token?: string) {
  return useQuery({
    queryKey: ["visit-check", token],
    queryFn: () => checkVisitToken(token!),
    enabled: !!token, // token 있을 때만 실행
  });
}

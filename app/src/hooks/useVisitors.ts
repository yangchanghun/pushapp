import { useEffect, useState } from "react";

export interface Visitor {
  id: number;
  name: string;
  phonenumber: string;
  visit_purpose: string;
  status: string;
  created_at: string;
  is_checked: boolean;
  professor_name: string;
  car_number: string;
  company_name: string;
  birthdate: string;
  token: string;
}

export function useVisitors(
  search: string,
  status: string,
  page: number,
  startDate?: string,
  endDate?: string
) {
  const [data, setData] = useState<Visitor[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVisitors = async () => {
      setLoading(true);

      const params = new URLSearchParams();

      params.append("page", String(page));

      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      try {
        const res = await fetch(
          `https://pushapp.kioedu.co.kr/api/visit/list/?${params.toString()}`
          // `${import.meta.env.VITE_API_URL}/api/visit/list/?${params}`
        );

        const json = await res.json();

        setData(json.results);
        setCount(json.count);
      } catch (err) {
        console.error("방문자 조회 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, [search, status, page, startDate, endDate]);

  return { data, count, loading, setData };
}

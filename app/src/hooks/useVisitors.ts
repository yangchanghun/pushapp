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
}

export function useVisitors(search: string, status: string, page: number) {
  const [data, setData] = useState<Visitor[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  console.log(data);
  useEffect(() => {
    const fetchVisitors = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        search,
        status,
        page: String(page),
      });

      const res = await fetch(
        `https://pushapp.kioedu.co.kr/api/visit/list/?${params}`
        // `${import.meta.env.VITE_API_URL}/api/visit/list/?${params}`
      );

      const json = await res.json();

      setData(json.results);
      setCount(json.count);
      setLoading(false);
    };

    fetchVisitors();
  }, [search, status, page]);

  return { data, count, loading };
}

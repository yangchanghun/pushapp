import { Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  // const API_URL = import.meta.env.VITE_API_URL;
  const API_URL = "https://pushapp.kioedu.co.kr";
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAllowed(false);
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/api/account/me/`, {
        headers: {
          Authorization: `Token ${token}`, // ⭐ 직접 넣기
        },
      })
      .then((res) => {
        if (res.data?.is_staff) setAllowed(true);
      })
      .catch(() => setAllowed(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return allowed ? children : <Navigate to="/admin/login" replace />;
}

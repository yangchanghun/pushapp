import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
// import type { VisitorsResponse, Visitor } from "../types/visitor";
interface Visitor {
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
interface VisitorsResponse {
  count: number;
  results: Visitor[];
}
interface Props {
  userId?: string;
}

type VisitorSocketMessage =
  | {
      type: "visitor_status_updated";
      token: string;
      status: string;
    }
  | {
      type: "visitor_created";
      visitor: Visitor;
    };

export default function useSocket({ userId }: Props) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = new WebSocket("wss://pushapp.kioedu.co.kr/ws/chat/1/");

    socket.onmessage = (event) => {
      try {
        const data: VisitorSocketMessage = JSON.parse(event.data);

        // 🔥 방문 상태 변경
        if (data.type === "visitor_status_updated") {
          queryClient.setQueriesData(
            { queryKey: ["visitors"] },
            (old: VisitorsResponse | undefined) => {
              if (!old) return old;

              return {
                ...old,
                results: old.results.map((v) =>
                  v.token === data.token ? { ...v, status: data.status } : v
                ),
              };
            }
          );
        }

        // 🔥 새 방문자
        if (data.type === "visitor_created") {
          queryClient.setQueriesData(
            { queryKey: ["visitors"] },
            (old: VisitorsResponse | undefined) => {
              if (!old) return old;

              if (old.results.some((v) => v.id === data.visitor.id)) {
                return old;
              }

              return {
                ...old,
                results: [data.visitor, ...old.results],
              };
            }
          );
        }
      } catch (e) {
        console.error("WebSocket parse error", e);
      }
    };

    return () => socket.close();
  }, [userId, queryClient]);
}

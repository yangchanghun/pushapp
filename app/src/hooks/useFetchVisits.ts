import { useEffect, useState } from "react";
import type { Message } from "../types/messages";
import type { VisitResponse } from "../types/visit";

export default function useFetchVisits(apiBase: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [checkedMessages, setCheckedMessages] = useState<Message[]>([]);
  console.log("들어오긴하냐?");
  // no_checked
  useEffect(() => {
    async function load() {
      const res = await fetch(`${apiBase}/api/visit/no_checked/`);
      const data: VisitResponse[] = await res.json();
      console.log("data:", data);

      setMessages(
        data.map((item) => ({
          sender: item.professor_name || "교수",
          visitor: item.name,
          text: `을 ${item.status}했습니다.`,
          token: item.token,
          createdAt: item.created_at,
        }))
      );
    }
    load();
  }, [apiBase]);

  // checked
  useEffect(() => {
    async function load() {
      console.log("들어오냐고");
      const res = await fetch(`${apiBase}/api/visit/checked/`);
      const data: VisitResponse[] = await res.json();
      console.log("res:", res);
      setCheckedMessages(
        data.map((item) => ({
          sender: item.professor_name || "교수",
          visitor: item.name,
          text: `을 ${item.status}했습니다.`,
          token: item.token,
          createdAt: item.created_at,
        }))
      );
    }
    load();
  }, [apiBase]);

  return { messages, checkedMessages, setMessages, setCheckedMessages };
}

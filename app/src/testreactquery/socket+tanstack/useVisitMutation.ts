// hooks/useVisitMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchVisitAction } from "./fetchVisitAction";
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

export interface VisitorsResponse {
  count: number;
  results: Visitor[];
}

export function useVisitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ action, token }: { action: string; token: string }) =>
      fetchVisitAction(action, token),

    onSuccess: (_data, variables) => {
      const { action, token } = variables;

      queryClient.setQueriesData(
        { queryKey: ["visitors"] },
        (old: VisitorsResponse | undefined) => {
          if (!old) return old;

          return {
            ...old,
            results: old.results.map((v) =>
              v.token === token
                ? {
                    ...v,
                    status: action === "accept" ? "수락" : "거절",
                  }
                : v
            ),
          };
        }
      );
    },
  });
}

import { useParams } from "react-router-dom";
import { useVisitCheck } from "./useVisitCheck";
import { useVisitMutation } from "./useVisitMutation";

export default function TestAcceptRejectPage() {
  const { token } = useParams<{ token: string }>();

  const { data, isLoading, isFetching } = useVisitCheck(token);

  console.log("loading:", isLoading);
  console.log("fetching:", isFetching);
  console.log("data:", data);
  const visitAction = useVisitMutation();
  // 최초 로딩만 처리
  // if (isLoading && !data) {
  //   return <div className="p-8 text-center">최초 로딩중...</div>;
  // }

  if (isLoading || !data?.valid) {
    return (
      <h2 style={{ color: "#ef4444" }}>
        {data?.message ?? "잘못된 요청입니다."}
      </h2>
    );
  }

  const { visitor } = data;

  return (
    <div style={{ background: "white", height: "100vh", textAlign: "center" }}>
      <h2>📩 방문 요청 처리</h2>
      <p>
        <b>{visitor.name}</b> 님의 방문 요청입니다.
        <br />
        목적: {visitor.visit_purpose}
      </p>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button
          disabled={visitAction.isPending}
          onClick={() =>
            visitAction.mutate({ action: "accept", token: token! })
          }
        >
          ✅ 수락
        </button>

        <button
          disabled={visitAction.isPending}
          onClick={() =>
            visitAction.mutate({ action: "reject", token: token! })
          }
        >
          ❌ 거절
        </button>
      </div>

      {visitAction.isSuccess && (
        <p style={{ marginTop: "1rem" }}>{visitAction.data}</p>
      )}

      {visitAction.isError && (
        <p style={{ color: "red" }}>처리 중 오류가 발생했습니다.</p>
      )}
    </div>
  );
}

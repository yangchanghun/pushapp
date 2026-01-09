// new QueryClient();는 최초 앱실행 시 한 번만 호출되며 전역에 저장소를 생성한다.
// 그리고 useQueryClient()는 최초에 생성한 저장소를 가져와 관리한다.

// useQuery를 사용하여 데이터를 호출하여 페칭및 서버상태를 관리할 수 있꼬
// useMutation을 사용하여 데이터를 변경하는 작업을 수행한다.

import { useQuery } from "@tanstack/react-query";
import { fetchVisitors } from "./fetchVisitors";

export function useVisitorsQuery(
  search: string,
  status: string,
  page: number,
  startDate?: string,
  endDate?: string
) {
  const params = new URLSearchParams();

  params.append("page", String(page));
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);
  console.log(params);
  return useQuery({
    queryKey: ["visitors", page, search, status, startDate, endDate], // 쿼리를 식별하는 고유 키
    queryFn: () => fetchVisitors(params), // 데이터를 가져오는 함수
    placeholderData: (previousData) => previousData, //
    staleTime: 1000 * 10, //  fresh한상태를 유지하는 시간으로 refetch를 하지 않는다. 기본값은 0으로 항상 stale상태로 페이지변경 후 다시 돌아오면 다시 refetch한다
    // 그니까 refetch하기 싫으면 저거 거셈.
    gcTime: 1000 * 10, // 쿼리를 사용하는 컴포넌트가 하나도 없어진 시점부터 10초 후 캐시된 데이터를 메모리세어 제거한다.
  });
}

// 주요 반환값

// const {data,isLoading,isFetching,error,status,refetch} = useVisitorsQuery(...);

// 리액트 쿼리는 서버 상태를 관리하고 비동기 데이터 페칭을 쉽게 해주는 라이브러리입니다.
// 자동으로 데이터 캐싱과 리페칭,에러 핸들링 등을 처리하여 개발자의 부담을 줄여줌
// useQuery, useMutation 훅을 사용하여 데이터를 가져오고 변이시킬 수 있습니다.

// 한마디로 주요 기술은 서버 상태 관리 및 비동기 데이터 페칭이라고 생각함.

// useMutation은 뭐지 ?

// Mutations

// export const mutation = useMutation({
//   mutationFn: (variables) => {
//     // 데이터 변경 로직
//   },
//   onSuccess: (data, variables) => {
//     // 성공 시 실행될 콜백
//   },
//   onError: (error, variables) => {
//     // 에러 발생 시 실행될 콜백
//   },
//   onSettled: (data, error, variables) => {
//     // 성공/실패 상관없이 완료 시 실행될 콜백
//   },
// });

// // mutation 실행
// mutation.mutate(variables);

// // 또는 비동기로 실행
// mutation.mutateAsync(variables);

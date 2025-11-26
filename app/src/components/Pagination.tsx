interface Props {
  page: number;
  setPage: (page: number) => void;
  total: number;
  pageSize?: number;
}

export default function Pagination({
  page,
  setPage,
  total,
  pageSize = 20,
}: Props) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex justify-center mt-6 space-x-4">
      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        이전
      </button>

      <span className="font-semibold">
        {page} / {totalPages}
      </span>

      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        다음
      </button>
    </div>
  );
}

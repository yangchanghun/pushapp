import { useState } from "react";

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

  const [inputValue, setInputValue] = useState<string>(String(page));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 숫자 외 입력 방지
    if (!/^[0-9]*$/.test(value)) return;
    if (value > String(totalPages)) return;
    setInputValue(value);
  };

  const handleGo = () => {
    if (!inputValue) return;
    const val = Number(inputValue);

    if (isNaN(val)) return;
    if (val < 1) return;
    if (val > totalPages) return;

    setPage(val);
  };

  return (
    <div className="flex justify-center mt-6 space-x-4 items-center">
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

      {/* 페이지 입력 */}
      <div className="flex items-center space-x-2">
        <input
          className="w-14 border px-2 py-1 rounded text-center"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleGo()}
          placeholder="페이지"
        />

        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={handleGo}
        >
          이동
        </button>
      </div>
    </div>
  );
}

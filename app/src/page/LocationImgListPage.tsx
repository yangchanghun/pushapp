import { useEffect, useState } from "react";
import axios from "axios";

type LocationImage = {
  id: number;
  code: string;
  image: string;
};

export const LocationImgListPage = () => {
  const apiBase = "https://pushapp.kioedu.co.kr";

  const [locationList, setLocationList] = useState<LocationImage[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get<LocationImage[]>(`${apiBase}/api/professors/location-image/list/`)
      .then((res) => {
        setLocationList(res.data);

        // 이미지 프리로드
        res.data.forEach((item) => {
          const img = new Image();
          img.src = `${apiBase}${item.image}`;
        });
      })
      .catch((err) => {
        console.error("위치 이미지 목록 불러오기 실패", err);
      });
  }, []);

  const selectedItem = locationList.find((item) => item.code === selectedCode);

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 px-4 py-10">
      <div className="w-full max-w-xl">
        <h1 className="text-center text-2xl font-bold mb-4">
          한국기계연구원 건물 위치
        </h1>
        <select
          value={selectedCode}
          onChange={(e) => {
            setSelectedCode(e.target.value);
            setIsZoomed(false);
          }}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option value="">위치를 선택해주세요</option>

          {locationList.map((item) => (
            <option key={item.id} value={item.code}>
              {item.code}
            </option>
          ))}
        </select>

        {selectedItem && (
          <div className="mt-6 text-center">
            {/* 기본 이미지 */}
            <img
              src={`${apiBase}${selectedItem.image}`}
              alt={selectedItem.code}
              className="mx-auto w-full max-w-xl rounded border shadow"
            />

            {/* 🔍 확대 버튼 */}
            <button
              onClick={() => setIsZoomed(true)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              크게 보기
            </button>
          </div>
        )}

        {/* 🔥 확대 모달 */}
        {isZoomed && selectedItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={() => setIsZoomed(false)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-2 right-2 text-black text-3xl font-bold hover:text-gray-300"
              >
                ×
              </button>

              {/* 확대 이미지 */}
              <img
                src={`${apiBase}${selectedItem.image}`}
                alt={selectedItem.code}
                className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

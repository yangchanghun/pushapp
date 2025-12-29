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

  useEffect(() => {
    axios
      .get<LocationImage[]>(`${apiBase}/api/professors/location-image/list/`)
      .then((res) => {
        setLocationList(res.data);

        res.data.forEach((item) => {
          const img = new Image();
          img.src = item.image;
        });
      })
      .catch((err) => {
        console.error("위치 이미지 목록 불러오기 실패", err);
      });
  }, []);

  const selectedItem = locationList.find((item) => item.code === selectedCode);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
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
          <img
            src={selectedItem.image}
            alt={selectedItem.code}
            className="mt-4 w-full rounded border"
          />
        )}
      </div>
    </div>
  );
};

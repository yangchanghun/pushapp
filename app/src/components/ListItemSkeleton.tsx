export default function ListItemSkeleton() {
  return (
    <div className="relative w-80">
      {/* 상단 고리 */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-10 h-10 bg-gradient-to-b from-yellow-700 to-yellow-800 rounded-full border-2 border-yellow-900 shadow-lg">
          <div className="w-4 h-5 bg-black mx-auto mt-1.5 rounded-full"></div>
        </div>
      </div>

      {/* 액자 프레임 */}
      <div className="relative bg-gradient-to-br from-yellow-700 via-yellow-800 to-yellow-900 p-5 shadow-2xl">
        {/* 내부 테두리 */}
        <div className="border-4 border-yellow-950 shadow-inner">
          {/* 스켈레톤 이미지 영역 */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gray-800 animate-pulse">
            {/* Shimmer 효과 */}
            <div className="absolute inset-0">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-gray-700/30 to-transparent -translate-x-full animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* 프레임 텍스처 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 pointer-events-none"></div>

        {/* 프레임 하이라이트 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
      </div>

      {/* 프레임 그림자 */}
      <div className="absolute inset-0 -z-10 bg-black/60 blur-xl translate-y-4"></div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

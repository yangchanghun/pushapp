export default function ChattingRoom() {
  return (
    <div>
      <div className="w-40 h-80 border-4 border-blue-500 bg-white">
        {/* 대충 채팅 오가는 내용 */}
        {/* id 1번 채팅방 */}
      </div>
      <input></input>
      <button>2번한테 채팅보내기</button>
      <button>2번아이디로 푸시 날리기</button>
      <button>1번 sw등록</button>
    </div>
  );
}
// 우선 아이디를 등록해야한다 그 엔드포인트하고 그런거 넘겨줘야하나 ?
// 장고로 그래야지 해당 엔드포인트에 푸시를 날리지
// 아닌가?
// 그리고 알림 권한도 있어야지 푸시를 날리지
// 그니까 1번 sw등록 버튼을 누르면 1번아이디가 저거 되게끔해보자

// 1. 비밀번호 입력 전 (목록)
export interface Item {
  id: number;
  name: string;
  post_image: string;
}

// 2. 비밀번호 인증 요청
export interface PasswordRequest {
  item_id: number;
  password: string;
}

// 3. 비밀번호 성공 시 응답
export interface GiftResponse {
  gift_image: string;
}

/*
이름, 게시물사진,비밀번호,비밀번호치면 나오는 기프티콘이미지,
비밀번호하고 비밀번호치면 나오는 이미지는 절대보안
*/

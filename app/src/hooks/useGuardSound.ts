// import { useRef, useState } from "react";
// import acceptSound from "@/assets/voice/accept.mp3";
// import rejectSound from "@/assets/voice/reject.mp3";

// export default function useGuardSound() {
//   const [soundEnabled, setSoundEnabled] = useState(false);

//   const acceptAudio = useRef<HTMLAudioElement | null>(null);
//   const rejectAudio = useRef<HTMLAudioElement | null>(null);

//   const enableSound = () => {
//     setSoundEnabled(true);

//     acceptAudio.current = new Audio(acceptSound);
//     rejectAudio.current = new Audio(rejectSound);

//     [acceptAudio.current, rejectAudio.current].forEach((audio) => {
//       audio.play().then(() => {
//         audio.pause();
//         audio.currentTime = 0;
//       });
//     });
//   };

//   return { soundEnabled, enableSound, acceptAudio, rejectAudio };
// }
import { useRef, useState } from "react";
import acceptSound from "@/assets/voice/accept.mp3";
import rejectSound from "@/assets/voice/reject.mp3";

export default function useGuardSound() {
  const [soundEnabled, setSoundEnabled] = useState(false); // 기본 ON

  const acceptAudio = useRef<HTMLAudioElement | null>(null);
  const rejectAudio = useRef<HTMLAudioElement | null>(null);

  // 🔵 최초 ON 시에만 Audio 생성 + 사용자 인터랙션 권한 잡기
  const initializeSounds = () => {
    if (!acceptAudio.current) {
      acceptAudio.current = new Audio(acceptSound);
      rejectAudio.current = new Audio(rejectSound);

      // iOS/Chrome 자동재생 허용 용도 (짧게 재생 후 pause)
      [acceptAudio.current, rejectAudio.current].forEach((audio) => {
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
        });
      });
    }
  };

  // 🔵 ON/OFF 토글
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const newState = !prev;

      if (newState === true) {
        // OFF → ON 전환 시 초기화
        initializeSounds();
      }
      return newState;
    });
  };

  return {
    soundEnabled,
    toggleSound,
    acceptAudio,
    rejectAudio,
  };
}

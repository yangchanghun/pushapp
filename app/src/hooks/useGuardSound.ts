import { useRef, useState } from "react";
import acceptSound from "@/assets/voice/accept.mp3";
import rejectSound from "@/assets/voice/reject.mp3";

export default function useGuardSound() {
  const [soundEnabled, setSoundEnabled] = useState(false);

  const acceptAudio = useRef<HTMLAudioElement | null>(null);
  const rejectAudio = useRef<HTMLAudioElement | null>(null);

  const enableSound = () => {
    setSoundEnabled(true);

    acceptAudio.current = new Audio(acceptSound);
    rejectAudio.current = new Audio(rejectSound);

    [acceptAudio.current, rejectAudio.current].forEach((audio) => {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      });
    });
  };

  return { soundEnabled, enableSound, acceptAudio, rejectAudio };
}

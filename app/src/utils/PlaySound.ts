// utils/PlaySound.ts

let soundEnabled = true;

// 🔥 사운드 캐시 (싱글톤)
const audioMap: Record<string, HTMLAudioElement> = {};

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function playSound(src: string) {
  if (!soundEnabled) return;

  // 🔥 최초 1번만 생성
  if (!audioMap[src]) {
    audioMap[src] = new Audio(src);
  }

  const audio = audioMap[src];

  // 🔥 중복 재생 방지
  audio.pause();
  audio.currentTime = 0;

  audio.play().catch(() => {
    // autoplay 차단 대비
  });
}

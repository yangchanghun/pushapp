// utils/PlaySound.ts

let soundEnabled = false;

// 사운드별 Audio 저장
const audioMap: Record<string, HTMLAudioElement> = {};

// 🔥 현재 재생 중인 Audio (핵심)
let currentAudio: HTMLAudioElement | null = null;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;

  // 🔇 OFF 시 즉시 소리 끄기
  if (!enabled && currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export function playSound(src: string) {
  if (!soundEnabled) return;

  // 🔥 이미 다른 소리 재생 중이면 즉시 중단
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  // 사운드 생성/재사용
  if (!audioMap[src]) {
    audioMap[src] = new Audio(src);
  }

  const audio = audioMap[src];
  currentAudio = audio;

  audio.currentTime = 0;
  audio.play().catch(() => {});
}

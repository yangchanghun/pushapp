let soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function playSound(src: string) {
  if (!soundEnabled) return;

  const audio = new Audio(src);
  audio.play().catch(() => {
    // autoplay 차단 대비
  });
}

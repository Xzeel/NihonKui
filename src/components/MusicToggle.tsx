import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const STORAGE_KEY = 'jp-quiz-bgm';

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio('/music/memories.mp3');
      audio.loop = true;
      audio.volume = 0.35;
      audioRef.current = audio;
    }
    const audio = audioRef.current;
    if (playing) audio.play().catch(() => {});
    else audio.pause();
    localStorage.setItem(STORAGE_KEY, String(playing));
  }, [playing]);

  return (
    <button
      onClick={() => setPlaying(p => !p)}
      className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
      aria-label="Toggle music"
    >
      {playing ? <Volume2 size={18} className="text-primary" /> : <VolumeX size={18} />}
    </button>
  );
}

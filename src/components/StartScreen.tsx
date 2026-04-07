import { animate } from 'motion';
import { useEffect, useRef, useCallback } from 'react';
import { Level, levelInfo } from '@/data/quizData';

interface StartScreenProps {
  onStart: (level: Level) => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll('[data-anim]');
    els.forEach((el, i) => {
      animate(el as HTMLElement, { opacity: [0, 1], y: [30, 0] }, { duration: 0.5, delay: i * 0.1, easing: 'ease-out' });
    });
  }, []);

  const handleClick = useCallback((level: Level, e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    animate(btn, { scale: [1, 0.95, 1] }, { duration: 0.2 });
    setTimeout(() => onStart(level), 200);
  }, [onStart]);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-seigaiha">
      <div data-anim className="text-6xl md:text-8xl mb-4 opacity-0">🌸⛩️🏯</div>
      <h1 data-anim className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-3 text-center opacity-0">
        Kuis Bahasa Jepang
      </h1>
      <p data-anim className="text-muted-foreground text-lg md:text-xl mb-10 text-center max-w-md opacity-0">
        Uji kemampuan bahasa Jepangmu! Pilih level dan mulai bermain.
      </p>

      <div data-anim className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-8 opacity-0">
        {(Object.keys(levelInfo) as Level[]).map((level) => {
          const info = levelInfo[level];
          return (
            <button
              key={level}
              onClick={(e) => handleClick(level, e)}
              className="group flex flex-col items-center gap-2 p-6 rounded-2xl bg-card border border-border hover:border-primary transition-colors shadow-sm hover:shadow-lg"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{info.icon}</span>
              <span className="font-heading font-semibold text-lg text-card-foreground">{info.title}</span>
              <span className="text-sm text-muted-foreground">{info.subtitle}</span>
            </button>
          );
        })}
      </div>

      <p data-anim className="text-xs text-muted-foreground opacity-0">10 soal per level • 30 detik per soal</p>
    </div>
  );
}

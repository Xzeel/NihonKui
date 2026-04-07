import { useEffect, useRef, useState } from 'react';
import { animate } from 'motion';

interface QuizToastProps {
  type: 'correct' | 'wrong' | null;
  onDone: () => void;
}

export default function QuizToast({ type, onDone }: QuizToastProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (type === null) { setVisible(false); return; }
    setVisible(true);
    if (ref.current) {
      animate(ref.current, { y: [-30, 0], opacity: [0, 1] }, { duration: 0.3, easing: 'ease-out' });
    }
    const timer = setTimeout(() => {
      if (ref.current) {
        animate(ref.current, { y: [0, -30], opacity: [1, 0] }, { duration: 0.25, easing: 'ease-in' });
      }
      setTimeout(() => { setVisible(false); onDone(); }, 250);
    }, 2500);
    return () => clearTimeout(timer);
  }, [type, onDone]);

  if (!visible || !type) return null;

  const isCorrect = type === 'correct';

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <div
        ref={ref}
        className={`px-5 py-3 rounded-xl shadow-lg font-heading font-medium text-sm flex items-center gap-2 ${
          isCorrect ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
        }`}
        style={{ opacity: 0 }}
      >
        <span className="text-lg">{isCorrect ? '✓' : '✗'}</span>
        {isCorrect ? 'Yay! Jawabanmu benar.' : 'Yahh, Sayang sekali jawabanmu salah.'}
      </div>
    </div>
  );
}

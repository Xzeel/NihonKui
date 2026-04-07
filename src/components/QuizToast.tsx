import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface QuizToastProps {
  type: 'correct' | 'wrong' | null;
  onDone: () => void;
}

export default function QuizToast({ type, onDone }: QuizToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (type === null) { setVisible(false); return; }
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onDone();
    }, 2500);
    return () => clearTimeout(timer);
  }, [type, onDone]);

  const isCorrect = type === 'correct';

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <AnimatePresence>
        {visible && type && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`px-5 py-3 rounded-xl shadow-lg font-heading font-medium text-sm flex items-center gap-2 ${
              isCorrect ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
            }`}
          >
            <span className="text-lg">{isCorrect ? '✓' : '✗'}</span>
            {isCorrect ? 'Yay! Jawabanmu benar.' : 'Yahh, Sayang sekali jawabanmu salah.'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

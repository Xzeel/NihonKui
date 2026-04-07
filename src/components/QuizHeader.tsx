import { motion } from 'motion/react';

interface QuizHeaderProps {
  currentIndex: number;
  total: number;
  score: number;
  streak: number;
  timer: number;
  selectedAnswer: string | null;
}

export default function QuizHeader({ currentIndex, total, score, streak, timer, selectedAnswer }: QuizHeaderProps) {
  const pct = ((currentIndex + (selectedAnswer ? 1 : 0)) / total) * 100;
  const isLow = timer <= 10 && !selectedAnswer;

  return (
    <div className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="h-1.5 bg-muted w-full">
        <motion.div
          className="h-full bg-primary rounded-r-full"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
        <span className="text-sm text-muted-foreground font-heading">
          Soal <span className="font-semibold text-foreground">{currentIndex + 1}</span> dari {total}
        </span>

        <div className="flex items-center gap-4">
          {streak >= 2 && (
            <span className="text-sm font-semibold text-secondary flex items-center gap-1">
              🔥 {streak}
            </span>
          )}
          <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
            ⭐ {score}
          </span>
          <span className={`text-sm font-mono font-bold min-w-[2.5rem] text-center rounded-md px-2 py-0.5 ${isLow ? 'bg-destructive/20 text-destructive animate-timer-pulse' : 'bg-muted text-foreground'}`}>
            {timer}s
          </span>
        </div>
      </div>
    </div>
  );
}

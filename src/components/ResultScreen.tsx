import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { QuizAnswer } from '@/hooks/useQuiz';
import { Question } from '@/data/quizData';
import SakuraConfetti from './SakuraConfetti';
import Footer from './Footer';

interface ResultScreenProps {
  score: number;
  total: number;
  answers: QuizAnswer[];
  questions: Question[];
  totalTime: number;
  maxStreak: number;
  onRestart: () => void;
  onHome: () => void;
}

function getMessage(pct: number) {
  if (pct >= 90) return { text: 'Luar biasa! Kamu hampir fasih berbahasa Jepang!', jp: '素晴らしい！', emoji: '🎉' };
  if (pct >= 70) return { text: 'Bagus sekali! Terus semangat belajar!', jp: 'がんばれ！', emoji: '👏' };
  if (pct >= 50) return { text: 'Lumayan! Masih banyak yang bisa dipelajari.', jp: 'もう少し！', emoji: '💪' };
  return { text: 'Jangan menyerah! Coba lagi ya.', jp: 'また挑戦しよう！', emoji: '🌱' };
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ResultScreen({ score, total, answers, questions, totalTime, maxStreak, onRestart, onHome }: ResultScreenProps) {
  const scoreRef = useRef<HTMLSpanElement>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const pct = Math.round((score / total) * 100);
  const msg = getMessage(pct);
  const wrongAnswers = answers.filter(a => !a.isCorrect);

  useEffect(() => {
    if (scoreRef.current) {
      const el = scoreRef.current;
      const duration = 1200;
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(eased * score));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [score]);

  const handleShare = () => {
    const text = `Saya mendapat skor ${score}/${total} (${pct}%) di Kuis Bahasa Jepang! ${msg.jp}`;
    if (navigator.share) {
      navigator.share({ title: 'Kuis Bahasa Jepang', text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <>
      {pct >= 70 && <SakuraConfetti />}
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center min-h-screen px-4 py-12 bg-seigaiha">
        <motion.div variants={fadeUp} className="text-6xl mb-2">{msg.emoji}</motion.div>
        <motion.div variants={fadeUp} className="text-center mb-6">
          <div className="text-7xl md:text-8xl font-heading font-bold text-primary mb-1">
            <span ref={scoreRef}>0</span><span className="text-3xl text-muted-foreground">/{total}</span>
          </div>
          <p className="text-xl font-heading font-semibold text-foreground mt-2">{msg.text}</p>
          <p className="text-2xl font-jp font-bold text-secondary mt-1">{msg.jp}</p>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg mb-8">
          {[
            { label: 'Benar', value: score, color: 'text-success' },
            { label: 'Salah', value: total - score, color: 'text-destructive' },
            { label: 'Akurasi', value: `${pct}%`, color: 'text-foreground' },
            { label: 'Waktu', value: `${Math.round(totalTime)}s`, color: 'text-foreground' },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-xl p-4 text-center border border-border">
              <div className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {maxStreak >= 2 && (
          <motion.div variants={fadeUp} className="text-sm text-secondary font-heading font-semibold mb-6">
            🔥 Streak terpanjang: {maxStreak} jawaban berturut-turut
          </motion.div>
        )}

        {wrongAnswers.length > 0 && (
          <motion.div variants={fadeUp} className="w-full max-w-lg mb-8">
            <h3 className="font-heading font-semibold text-foreground mb-3">Review Jawaban Salah</h3>
            <div className="space-y-2">
              {wrongAnswers.map((a, i) => {
                const q = questions.find(q => q.id === a.questionId);
                if (!q) return null;
                const isOpen = expandedIdx === i;
                return (
                  <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                    <button
                      onClick={() => setExpandedIdx(isOpen ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <span className="font-jp font-bold text-lg text-card-foreground">{q.japanese}</span>
                      <span className="text-muted-foreground text-sm">{isOpen ? '▲' : '▼'}</span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm space-y-1">
                        <p className="text-card-foreground">{q.question}</p>
                        <p className="text-destructive">Jawabanmu: {a.selected}</p>
                        <p className="text-success">Jawaban benar: {a.correct}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onRestart} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold hover:opacity-90 transition-opacity">
            Coba Lagi
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onHome} className="flex-1 py-3 rounded-xl bg-muted text-foreground font-heading font-semibold hover:opacity-90 transition-opacity border border-border">
            Ganti Level
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleShare} className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-heading font-semibold hover:opacity-90 transition-opacity">
            Bagikan Skor
          </motion.button>
        </motion.div>

        <Footer />
      </motion.div>
    </>
  );
}

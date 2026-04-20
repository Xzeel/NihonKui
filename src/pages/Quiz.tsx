import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Flame, Clock, Check, X, Trophy, RotateCcw, Home as HomeIcon, BookOpen } from 'lucide-react';
import { Level, Question, questions as allQuestions } from '@/data/quizData';
import SakuraConfetti from '@/components/SakuraConfetti';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

const TIMER = 30;

interface Toast { id: number; type: 'success' | 'error'; msg: string; }

export default function Quiz() {
  const [phase, setPhase] = useState<'start' | 'quiz' | 'result'>('start');
  const [level, setLevel] = useState<Level | null>(null);
  const [qList, setQList] = useState<Question[]>([]);
  const [opts, setOpts] = useState<string[][]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timer, setTimer] = useState(TIMER);
  const [answers, setAnswers] = useState<{ q: Question; chosen: string; correct: boolean }[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [displayScore, setDisplayScore] = useState(0);
  const tRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearT = () => { if (tRef.current) { clearInterval(tRef.current); tRef.current = null; } };

  const startQuiz = (lvl: Level) => {
    const sq = shuffle(allQuestions[lvl]);
    setLevel(lvl); setQList(sq);
    setOpts(sq.map(q => shuffle([q.correctAnswer, ...q.distractors])));
    setIdx(0); setScore(0); setStreak(0); setMaxStreak(0); setSelected(null); setAnswered(false);
    setAnswers([]); setStartTime(Date.now()); setTimer(TIMER); setPhase('quiz');
  };

  const showToast = (type: 'success' | 'error', msg: string) => {
    const id = Date.now();
    setToasts(t => [...t, { id, type, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2500);
  };

  const evaluate = useCallback(() => {
    if (!selected || answered) return;
    clearT();
    const q = qList[idx];
    const isCorrect = selected === q.correctAnswer;
    setAnswered(true);
    setAnswers(a => [...a, { q, chosen: selected, correct: isCorrect }]);
    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => { const ns = s + 1; setMaxStreak(m => Math.max(m, ns)); return ns; });
      showToast('success', 'Yay! Jawabanmu benar.');
    } else {
      setStreak(0);
      showToast('error', 'Yahh, Sayang sekali jawabanmu salah.');
    }
  }, [selected, answered, qList, idx]);

  const next = () => {
    if (idx + 1 >= qList.length) {
      setTotalTime((Date.now() - startTime) / 1000);
      setPhase('result');
    } else {
      setIdx(i => i + 1); setSelected(null); setAnswered(false); setTimer(TIMER);
    }
  };

  // Timer
  useEffect(() => {
    if (phase !== 'quiz' || answered) return;
    setTimer(TIMER);
    tRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearT();
          // auto submit
          setAnswered(true);
          setAnswers(a => [...a, { q: qList[idx], chosen: '(Waktu habis)', correct: false }]);
          setStreak(0);
          showToast('error', 'Yahh, waktu habis!');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearT;
  }, [phase, idx, answered, qList]);

  // Score count up
  useEffect(() => {
    if (phase !== 'result') return;
    let s = 0;
    const step = setInterval(() => {
      s++; setDisplayScore(s);
      if (s >= score) clearInterval(step);
    }, 60);
    return () => clearInterval(step);
  }, [phase, score]);

  // ---------- START SCREEN ----------
  if (phase === 'start') {
    const levels: { key: Level; label: string; desc: string; emoji: string }[] = [
      { key: 'pemula', label: 'Pemula', desc: 'Hiragana, Katakana & Kosakata Dasar', emoji: 'あ' },
      { key: 'menengah', label: 'Menengah', desc: 'Kosakata, Kata Kerja, Tata Bahasa', emoji: '本' },
      { key: 'lanjutan', label: 'Lanjutan', desc: 'Kanji, Keigo & Pola Lanjut', emoji: '漢' },
    ];
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Pilih Level Kuis</h1>
          <p className="text-muted-foreground">50 soal per level, diacak setiap sesi.</p>
        </motion.div>
        <div className="space-y-4">
          {levels.map((l, i) => (
            <motion.button
              key={l.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startQuiz(l.key)}
              className="w-full bg-card border border-border rounded-3xl p-6 flex items-center gap-5 hover:border-primary hover:shadow-lg transition-all text-left"
            >
              <div className="font-jp text-5xl text-primary">{l.emoji}</div>
              <div className="flex-1">
                <div className="text-xl font-bold">{l.label}</div>
                <div className="text-sm text-muted-foreground">{l.desc}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ---------- RESULT SCREEN ----------
  if (phase === 'result') {
    const pct = Math.round((score / qList.length) * 100);
    const wrong = answers.filter(a => !a.correct);
    const msg = pct >= 90 ? 'Luar biasa! 素晴らしい！'
      : pct >= 70 ? 'Bagus sekali! がんばれ！'
      : pct >= 50 ? 'Lumayan! もう少し！'
      : 'Jangan menyerah! また挑戦しよう！';
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {pct >= 70 && <SakuraConfetti />}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border border-border rounded-3xl p-8 md:p-12 text-center">
          <Trophy className="mx-auto text-primary mb-4" size={64} />
          <div className="text-7xl md:text-8xl font-bold text-primary mb-2">{displayScore}<span className="text-3xl text-muted-foreground">/{qList.length}</span></div>
          <div className="text-2xl font-jp font-bold mb-6">{msg}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <Stat label="Benar" value={String(score)} />
            <Stat label="Salah" value={String(qList.length - score)} />
            <Stat label="Akurasi" value={`${pct}%`} />
            <Stat label="Waktu" value={`${Math.round(totalTime)}s`} />
          </div>
          {wrong.length > 0 && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer font-semibold mb-2">Review {wrong.length} soal salah</summary>
              <div className="space-y-2 mt-3">
                {wrong.map((w, i) => (
                  <div key={i} className="bg-muted rounded-xl p-3 text-sm">
                    <div className="font-jp text-xl mb-1">{w.q.japanese}</div>
                    <div className="text-destructive">Jawabanmu: {w.chosen}</div>
                    <div className="text-success">Benar: {w.q.correctAnswer}</div>
                  </div>
                ))}
              </div>
            </details>
          )}
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => level && startQuiz(level)} className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform">
              <RotateCcw size={18} /> Coba Lagi
            </button>
            <button onClick={() => setPhase('start')} className="bg-card border border-border px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform">
              <HomeIcon size={18} /> Ganti Level
            </button>
            <Link to="/courses" className="bg-card border border-border px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform">
              <BookOpen size={18} /> Lihat Materi
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------- QUIZ SCREEN ----------
  const q = qList[idx];
  const progress = ((idx + (answered ? 1 : 0)) / qList.length) * 100;

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Sticky header */}
      <div className="sticky top-16 z-40 bg-background/90 backdrop-blur border-b border-border">
        <div className="h-2 bg-muted">
          <motion.div className="h-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: 'easeInOut' }} />
        </div>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm font-semibold">Soal {idx + 1} dari {qList.length}</div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-secondary"><Star size={16} fill="currentColor" /> {score}</span>
            <span className="flex items-center gap-1 text-primary"><Flame size={16} /> {streak}</span>
            <span className={`flex items-center gap-1 ${timer <= 10 && !answered ? 'text-destructive animate-timer-pulse' : ''}`}>
              <Clock size={16} /> {timer}s
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm"
          >
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground mb-4">{q.category}</span>
            <p className="text-sm md:text-base text-muted-foreground mb-3">{q.question}</p>
            <div className="font-jp text-4xl md:text-5xl font-bold text-center my-6 break-words">{q.japanese}</div>
            {q.romaji && <div className="text-sm text-center text-muted-foreground -mt-4 mb-4">{q.romaji}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {opts[idx].map((opt, i) => {
                const letter = ['A', 'B', 'C', 'D'][i];
                const isSel = selected === opt;
                const isCorrect = answered && opt === q.correctAnswer;
                const isWrong = answered && isSel && opt !== q.correctAnswer;
                let cls = 'border-border hover:border-primary';
                if (isCorrect) cls = 'border-success bg-success/10 text-success';
                else if (isWrong) cls = 'border-destructive bg-destructive/10 text-destructive';
                else if (isSel && !answered) cls = 'border-primary bg-primary/5';
                return (
                  <motion.button
                    key={i}
                    whileHover={!answered ? { scale: 1.03 } : {}}
                    whileTap={!answered ? { scale: 0.97 } : {}}
                    disabled={answered}
                    onClick={() => !answered && setSelected(opt)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-colors text-left ${cls} disabled:cursor-not-allowed`}
                  >
                    <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm shrink-0">{letter}</span>
                    <span className="flex-1">{opt}</span>
                    {isCorrect && <Check size={18} />}
                    {isWrong && <X size={18} />}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              {!answered ? (
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={evaluate} disabled={!selected}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Jawab
                </motion.button>
              ) : (
                <motion.button
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={next}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-semibold"
                >
                  {idx + 1 >= qList.length ? 'Lihat Hasil' : 'Soal Berikutnya'}
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Toasts */}
      <div className="fixed top-20 right-4 z-50 md:top-20 md:right-4 max-md:left-4 max-md:right-4 max-md:bottom-4 max-md:top-auto space-y-2">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className={`px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 ${
                t.type === 'success' ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
              }`}
            >
              {t.type === 'success' ? <Check size={18} /> : <X size={18} />}
              <span className="font-medium text-sm">{t.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted rounded-2xl p-3">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

import { useState, useCallback, useEffect, useRef } from 'react';
import { Level, Question, questions as allQuestions } from '@/data/quizData';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface QuizAnswer {
  questionId: number;
  selected: string;
  correct: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizState {
  phase: 'start' | 'quiz' | 'result';
  level: Level | null;
  questions: Question[];
  shuffledOptions: string[][];
  currentIndex: number;
  score: number;
  streak: number;
  maxStreak: number;
  answers: QuizAnswer[];
  startTime: number;
  totalTime: number;
  timer: number;
  selectedAnswer: string | null;
}

const TIMER_DURATION = 30;

function getHighScores(): Record<Level, number> {
  try {
    const raw = localStorage.getItem('jp-quiz-highscores');
    return raw ? JSON.parse(raw) : { pemula: 0, menengah: 0, lanjutan: 0 };
  } catch {
    return { pemula: 0, menengah: 0, lanjutan: 0 };
  }
}

function saveHighScore(level: Level, score: number) {
  const scores = getHighScores();
  if (score > scores[level]) {
    scores[level] = score;
    localStorage.setItem('jp-quiz-highscores', JSON.stringify(scores));
  }
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>({
    phase: 'start',
    level: null,
    questions: [],
    shuffledOptions: [],
    currentIndex: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    answers: [],
    startTime: 0,
    totalTime: 0,
    timer: TIMER_DURATION,
    selectedAnswer: null,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartRef = useRef<number>(Date.now());

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    setState(s => ({ ...s, timer: TIMER_DURATION }));
    questionStartRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setState(s => {
        const newTimer = s.timer - 1;
        if (newTimer <= 0) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          // Auto-submit wrong answer on timeout
          const q = s.questions[s.currentIndex];
          if (q && !s.selectedAnswer) {
            const timeSpent = (Date.now() - questionStartRef.current) / 1000;
            return {
              ...s,
              timer: 0,
              selectedAnswer: '__timeout__',
              streak: 0,
              answers: [...s.answers, {
                questionId: q.id,
                selected: '(Waktu habis)',
                correct: q.correctAnswer,
                isCorrect: false,
                timeSpent,
              }],
            };
          }
          return { ...s, timer: 0 };
        }
        return { ...s, timer: newTimer };
      });
    }, 1000);
  }, [clearTimer]);

  const startQuiz = useCallback((level: Level) => {
    const shuffledQ = shuffle(allQuestions[level]);
    const shuffledOpts = shuffledQ.map(q => shuffle([q.correctAnswer, ...q.distractors]));
    setState({
      phase: 'quiz',
      level,
      questions: shuffledQ,
      shuffledOptions: shuffledOpts,
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      answers: [],
      startTime: Date.now(),
      totalTime: 0,
      timer: TIMER_DURATION,
      selectedAnswer: null,
    });
    questionStartRef.current = Date.now();
  }, []);

  // Start timer when quiz starts or question changes
  useEffect(() => {
    if (state.phase === 'quiz' && state.selectedAnswer === null) {
      startTimer();
    }
    return clearTimer;
  }, [state.phase, state.currentIndex, state.selectedAnswer, startTimer, clearTimer]);

  const selectAnswer = useCallback((answer: string) => {
    setState(s => {
      if (s.selectedAnswer !== null) return s;
      clearTimer();
      const q = s.questions[s.currentIndex];
      const isCorrect = answer === q.correctAnswer;
      const timeSpent = (Date.now() - questionStartRef.current) / 1000;
      const newStreak = isCorrect ? s.streak + 1 : 0;
      return {
        ...s,
        selectedAnswer: answer,
        score: isCorrect ? s.score + 1 : s.score,
        streak: newStreak,
        maxStreak: Math.max(s.maxStreak, newStreak),
        answers: [...s.answers, {
          questionId: q.id,
          selected: answer,
          correct: q.correctAnswer,
          isCorrect,
          timeSpent,
        }],
      };
    });
  }, [clearTimer]);

  const nextQuestion = useCallback(() => {
    setState(s => {
      const nextIdx = s.currentIndex + 1;
      if (nextIdx >= s.questions.length) {
        const totalTime = (Date.now() - s.startTime) / 1000;
        if (s.level) saveHighScore(s.level, s.score);
        return { ...s, phase: 'result' as const, totalTime, selectedAnswer: null };
      }
      return { ...s, currentIndex: nextIdx, selectedAnswer: null };
    });
    questionStartRef.current = Date.now();
  }, []);

  const restart = useCallback(() => {
    if (state.level) startQuiz(state.level);
  }, [state.level, startQuiz]);

  const goHome = useCallback(() => {
    clearTimer();
    setState(s => ({ ...s, phase: 'start', level: null, selectedAnswer: null }));
  }, [clearTimer]);

  return { state, startQuiz, selectAnswer, nextQuestion, restart, goHome, highScores: getHighScores() };
}

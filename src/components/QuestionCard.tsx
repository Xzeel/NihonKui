import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '@/data/quizData';
import AnswerButton from './AnswerButton';
import QuizToast from './QuizToast';

interface QuestionCardProps {
  question: Question;
  options: string[];
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  onNext: () => void;
  questionKey: number;
}

export default function QuestionCard({ question, options, selectedAnswer, onSelect, onNext, questionKey }: QuestionCardProps) {
  const [toastType, setToastType] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    setToastType(null);
  }, [questionKey]);

  useEffect(() => {
    if (selectedAnswer !== null) {
      const isCorrect = selectedAnswer === question.correctAnswer;
      setToastType(isCorrect ? 'correct' : 'wrong');
    }
  }, [selectedAnswer, question.correctAnswer]);

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <>
      <QuizToast type={toastType} onDone={() => setToastType(null)} />

      <AnimatePresence mode="wait">
        <motion.div
          key={questionKey}
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-2xl mx-auto px-4"
        >
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8 mb-6">
            <span className="text-xs font-heading font-medium text-secondary uppercase tracking-wider">{question.category}</span>
            <p className="mt-3 text-lg font-heading font-medium text-card-foreground">{question.question}</p>
            <p className="mt-4 text-5xl md:text-6xl font-jp font-bold text-card-foreground text-center py-4">{question.japanese}</p>
            {question.romaji && (
              <p className="text-center text-sm text-muted-foreground italic">{question.romaji}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {options.map((opt, i) => (
              <AnswerButton
                key={opt}
                letter={letters[i]}
                text={opt}
                selected={selectedAnswer}
                correctAnswer={question.correctAnswer}
                onSelect={onSelect}
              />
            ))}
          </div>

          <AnimatePresence>
            {selectedAnswer !== null && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                onClick={onNext}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Soal Berikutnya →
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

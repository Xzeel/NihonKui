import { useEffect, useRef, useState } from 'react';
import { animate } from 'motion';
import { Question } from '@/data/quizData';
import AnswerButton from './AnswerButton';
import QuizToast from './QuizToast';

interface QuestionCardProps {
  question: Question;
  options: string[];
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  onNext: () => void;
  questionKey: number; // currentIndex to trigger animation
}

export default function QuestionCard({ question, options, selectedAnswer, onSelect, onNext, questionKey }: QuestionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const [toastType, setToastType] = useState<'correct' | 'wrong' | null>(null);

  // Card entrance animation
  useEffect(() => {
    if (cardRef.current) {
      animate(cardRef.current, { x: [80, 0], opacity: [0, 1] }, { duration: 0.4, easing: 'ease-out' });
    }
    setToastType(null);
  }, [questionKey]);

  // Show toast + next button animation when answer selected
  useEffect(() => {
    if (selectedAnswer !== null) {
      const isCorrect = selectedAnswer === question.correctAnswer;
      setToastType(isCorrect ? 'correct' : 'wrong');
      if (nextBtnRef.current) {
        animate(nextBtnRef.current, { opacity: [0, 1], y: [10, 0] }, { duration: 0.3, delay: 0.3 });
      }
    }
  }, [selectedAnswer, question.correctAnswer]);

  const handleNext = () => {
    if (cardRef.current) {
      animate(cardRef.current, { x: [0, -80], opacity: [1, 0] }, { duration: 0.3, easing: 'ease-in' });
    }
    setTimeout(onNext, 300);
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <>
      <QuizToast type={toastType} onDone={() => setToastType(null)} />

      <div ref={cardRef} className="w-full max-w-2xl mx-auto px-4" style={{ opacity: 0 }}>
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

        {selectedAnswer !== null && (
          <button
            ref={nextBtnRef}
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-lg hover:opacity-90 transition-opacity"
            style={{ opacity: 0 }}
          >
            {/* If last question, show different text */}
            Soal Berikutnya →
          </button>
        )}
      </div>
    </>
  );
}

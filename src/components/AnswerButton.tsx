import { useRef, useCallback } from 'react';
import { animate } from 'motion';

interface AnswerButtonProps {
  letter: string;
  text: string;
  selected: string | null;
  correctAnswer: string;
  onSelect: (answer: string) => void;
}

export default function AnswerButton({ letter, text, selected, correctAnswer, onSelect }: AnswerButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const isDisabled = selected !== null;
  const isSelected = selected === text;
  const isCorrect = text === correctAnswer;
  const showResult = selected !== null;

  const handleClick = useCallback(() => {
    if (isDisabled) return;
    if (btnRef.current) {
      animate(btnRef.current, { scale: [1, 0.95, 1] }, { duration: 0.15 });
    }
    onSelect(text);
  }, [isDisabled, onSelect, text]);

  const handleMouseEnter = useCallback(() => {
    if (isDisabled || !btnRef.current) return;
    animate(btnRef.current, { scale: 1.03 }, { duration: 0.15, easing: 'ease-out' });
  }, [isDisabled]);

  const handleMouseLeave = useCallback(() => {
    if (isDisabled || !btnRef.current) return;
    animate(btnRef.current, { scale: 1 }, { duration: 0.15, easing: 'ease-out' });
  }, [isDisabled]);

  let classes = 'flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors font-heading min-h-[56px]';
  if (showResult && isCorrect) {
    classes += ' border-success bg-success/10 text-success';
  } else if (showResult && isSelected && !isCorrect) {
    classes += ' border-destructive bg-destructive/10 text-destructive';
  } else if (showResult) {
    classes += ' border-border bg-muted/50 text-muted-foreground opacity-60';
  } else {
    classes += ' border-border bg-card text-card-foreground hover:border-primary cursor-pointer';
  }

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      disabled={isDisabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={classes}
    >
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
        showResult && isCorrect ? 'bg-success text-success-foreground' :
        showResult && isSelected && !isCorrect ? 'bg-destructive text-destructive-foreground' :
        'bg-muted text-muted-foreground'
      }`}>
        {showResult && isCorrect ? '✓' : showResult && isSelected && !isCorrect ? '✗' : letter}
      </span>
      <span className="font-medium">{text}</span>
    </button>
  );
}

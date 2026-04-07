import { motion } from 'motion/react';

interface AnswerButtonProps {
  letter: string;
  text: string;
  selected: string | null;
  correctAnswer: string;
  onSelect: (answer: string) => void;
}

export default function AnswerButton({ letter, text, selected, correctAnswer, onSelect }: AnswerButtonProps) {
  const isDisabled = selected !== null;
  const isSelected = selected === text;
  const isCorrect = text === correctAnswer;
  const showResult = selected !== null;

  let classes = 'flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors font-heading min-h-[56px] w-full';
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
    <motion.button
      whileHover={isDisabled ? {} : { scale: 1.03 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      onClick={() => !isDisabled && onSelect(text)}
      disabled={isDisabled}
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
    </motion.button>
  );
}

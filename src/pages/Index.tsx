import { useQuiz } from '@/hooks/useQuiz';
import StartScreen from '@/components/StartScreen';
import QuizHeader from '@/components/QuizHeader';
import QuestionCard from '@/components/QuestionCard';
import ResultScreen from '@/components/ResultScreen';
import DarkModeToggle from '@/components/DarkModeToggle';
import MusicToggle from '@/components/MusicToggle';
import Footer from '@/components/Footer';

const Index = () => {
  const { state, startQuiz, selectAnswer, nextQuestion, restart, goHome } = useQuiz();

  return (
    <div className="min-h-screen bg-background">
      <DarkModeToggle />
      <MusicToggle />

      {state.phase === 'start' && <StartScreen onStart={startQuiz} />}

      {state.phase === 'quiz' && (
        <div className="min-h-screen flex flex-col">
          <QuizHeader
            currentIndex={state.currentIndex}
            total={state.questions.length}
            score={state.score}
            streak={state.streak}
            timer={state.timer}
            selectedAnswer={state.selectedAnswer}
          />
          <div className="flex-1 flex items-start justify-center pt-8 pb-12">
            <QuestionCard
              question={state.questions[state.currentIndex]}
              options={state.shuffledOptions[state.currentIndex]}
              selectedAnswer={state.selectedAnswer}
              onSelect={selectAnswer}
              onNext={nextQuestion}
              questionKey={state.currentIndex}
            />
          </div>
          <Footer />
        </div>
      )}

      {state.phase === 'result' && (
        <ResultScreen
          score={state.score}
          total={state.questions.length}
          answers={state.answers}
          questions={state.questions}
          totalTime={state.totalTime}
          maxStreak={state.maxStreak}
          onRestart={restart}
          onHome={goHome}
        />
      )}
    </div>
  );
};

export default Index;

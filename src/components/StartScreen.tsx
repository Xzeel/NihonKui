import { motion } from 'motion/react';
import { useCallback } from 'react';
import { Level, levelInfo } from '@/data/quizData';

interface StartScreenProps {
  onStart: (level: Level) => void;
}

const staggerChildren = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function StartScreen({ onStart }: StartScreenProps) {
  const handleClick = useCallback((level: Level) => {
    setTimeout(() => onStart(level), 150);
  }, [onStart]);

  return (
    <motion.div
      variants={staggerChildren}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-seigaiha"
    >
      <motion.div variants={fadeUp} className="text-6xl md:text-8xl mb-4">🌸⛩️🏯</motion.div>
      <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-3 text-center">
        Kuis Bahasa Jepang
      </motion.h1>
      <motion.p variants={fadeUp} className="text-muted-foreground text-lg md:text-xl mb-10 text-center max-w-md">
        Uji kemampuan bahasa Jepangmu! Pilih level dan mulai bermain.
      </motion.p>

      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
        {(Object.keys(levelInfo) as Level[]).map((level) => {
          const info = levelInfo[level];
          return (
            <motion.button
              key={level}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleClick(level)}
              className="group flex flex-col items-center gap-2 p-6 rounded-2xl bg-card border border-border hover:border-primary transition-colors shadow-sm hover:shadow-lg"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{info.icon}</span>
              <span className="font-heading font-semibold text-lg text-card-foreground">{info.title}</span>
              <span className="text-sm text-muted-foreground">{info.subtitle}</span>
            </motion.button>
          );
        })}
      </motion.div>

      <motion.p variants={fadeUp} className="text-xs text-muted-foreground">10 soal per level • 30 detik per soal</motion.p>
    </motion.div>
  );
}

import { motion } from 'motion/react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <motion.footer variants={fadeUp} initial="hidden" animate="show" className="mt-auto pt-12 pb-6 text-center">
      <p className="text-sm text-muted-foreground">© {year} Japanese Quiz. All Rights Reserved.</p>
      <p className="text-xs text-muted-foreground/70 mt-1">Dibuat dengan 💖 oleh XzeelArcadia</p>
    </motion.footer>
  );
}

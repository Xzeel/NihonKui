import { motion } from 'motion/react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <motion.footer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-t border-border py-6 text-center bg-background"
    >
      <p className="text-sm text-muted-foreground">© {year} NihonKui. All Rights Reserved.</p>
      <p className="text-xs text-muted-foreground/70 mt-1">Dibuat dengan 💖 oleh XzeelArcadia</p>
    </motion.footer>
  );
}

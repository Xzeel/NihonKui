import { useDarkMode } from '@/hooks/useDarkMode';

export default function DarkModeToggle() {
  const { dark, toggle } = useDarkMode();
  return (
    <button
      onClick={toggle}
      className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-lg shadow-sm hover:scale-105 transition-transform"
      aria-label="Toggle dark mode"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}

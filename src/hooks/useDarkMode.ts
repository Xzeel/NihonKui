import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('jp-quiz-dark') === 'true';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('jp-quiz-dark', String(dark));
  }, [dark]);

  return { dark, toggle: () => setDark(d => !d) };
}

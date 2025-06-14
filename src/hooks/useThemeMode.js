import { useState, useEffect } from 'react';

export function useThemeMode() {
  const [theme, setTheme] = useState(document.body.classList.contains('dark') ? 'dark' : 'light');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.classList.contains('dark') ? 'dark' : 'light');
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return theme;
}

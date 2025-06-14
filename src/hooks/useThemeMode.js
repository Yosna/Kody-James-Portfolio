import { useState, useEffect } from 'react';

export function useThemeMode() {
  const themes = ['light', 'dark', 'midnight', 'glacier'];
  const getCurrentTheme = () => {
    return themes.find((t) => document.body.classList.contains(t)) || 'light';
  };
  const [theme, setTheme] = useState(getCurrentTheme());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(getCurrentTheme());
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return theme;
}

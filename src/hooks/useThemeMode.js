import { useState, useEffect } from 'react';

export function useThemeMode() {
  const themes = ['light', 'dark', 'midnight', 'glacier'];
  // Read from localStorage for initial state
  const getInitialTheme = () => {
    let theme = localStorage.getItem('color-theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themes.includes(theme) ? theme : 'light';
  };
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      // Always prefer localStorage for React state
      setTheme(getInitialTheme());
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return theme;
}

export function useSyntaxThemeMode() {
  const themes = ['light', 'dark', 'midnight', 'glacier'];
  // Try to get from localStorage, else fall back to color-theme, else 'light'
  const getCurrentSyntaxTheme = () => {
    return (
      localStorage.getItem('syntax-theme') ||
      localStorage.getItem('color-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );
  };
  const [syntaxTheme, setSyntaxTheme] = useState(getCurrentSyntaxTheme());

  // Listen for changes to localStorage
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'syntax-theme') {
        setSyntaxTheme(e.newValue || getCurrentSyntaxTheme());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Provide a setter that also updates localStorage
  const setAndPersistSyntaxTheme = (theme) => {
    setSyntaxTheme(theme);
    localStorage.setItem('syntax-theme', theme);
  };

  return [syntaxTheme, setAndPersistSyntaxTheme, themes];
}

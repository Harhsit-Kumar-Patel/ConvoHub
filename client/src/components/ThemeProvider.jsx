import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const THEME_KEY = 'convohub_theme';
const SETTINGS_KEY = 'convohub_settings';

const defaultSettings = {
  theme: 'system', // 'light' | 'dark' | 'system'
  fontScale: 1, // 0.875, 1, 1.125, 1.25
  highContrast: false,
};

const ThemeContext = createContext({
  settings: defaultSettings,
  setTheme: () => {},
  setFontScale: () => {},
  setHighContrast: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
    } catch {}
    return defaultSettings;
  });

  const resolvedTheme = useMemo(() => {
    if (settings.theme === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return settings.theme;
  }, [settings.theme]);

  useEffect(() => {
    const root = document.documentElement;

    // Dark mode class
    if (resolvedTheme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');

    // Font scaling via CSS var
    root.style.setProperty('--font-scale', String(settings.fontScale));

    // High contrast tweaks via CSS var flag
    root.style.setProperty('--contrast-multiplier', settings.highContrast ? '1.1' : '1');

    // Persist
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch {}
  }, [settings, resolvedTheme]);

  // Listen to system theme changes when in system mode
  useEffect(() => {
    if (settings.theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setSettings((s) => ({ ...s }));
    media.addEventListener?.('change', handler);
    return () => media.removeEventListener?.('change', handler);
  }, [settings.theme]);

  const api = useMemo(() => ({
    settings,
    setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
    setFontScale: (fontScale) => setSettings((s) => ({ ...s, fontScale })),
    setHighContrast: (highContrast) => setSettings((s) => ({ ...s, highContrast })),
    toggleTheme: () => setSettings((s) => ({ ...s, theme: (s.theme === 'dark' ? 'light' : 'dark') })),
  }), [settings]);

  return (
    <ThemeContext.Provider value={api}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

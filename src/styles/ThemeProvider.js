import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { withTheme } from './theme';
import { getThemePreference, setThemePreference } from '../utils/storage';

// mode: 'light' | 'dark'
const ThemeContext = createContext({
  mode: 'light',
  isDark: false,
  colors: withTheme(false),
  setMode: (_m) => {},
});

export const ThemeProvider = ({ children }) => {
  const [mode, setModeState] = useState('light');

  useEffect(() => {
    (async () => {
      const pref = await getThemePreference();
      if (pref === 'light' || pref === 'dark') setModeState(pref);
      else setModeState('light');
    })();
  }, []);

  const isDark = useMemo(() => mode === 'dark', [mode]);

  const colors = useMemo(() => withTheme(isDark), [isDark]);

  const setMode = async (m) => {
    if (m !== 'light' && m !== 'dark') return;
    setModeState(m);
    await setThemePreference(m);
  };

  const value = useMemo(() => ({ mode, isDark, colors, setMode }), [mode, isDark, colors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

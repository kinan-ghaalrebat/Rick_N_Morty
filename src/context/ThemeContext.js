import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [characterTheme, setCharacterTheme] = useState('default');
  const [portalIntensity, setPortalIntensity] = useState('medium');

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('rickmorty-theme');
    const savedCharacterTheme = localStorage.getItem('rickmorty-character-theme');
    const savedPortalIntensity = localStorage.getItem('rickmorty-portal-intensity');
    
    if (savedTheme) setTheme(savedTheme);
    if (savedCharacterTheme) setCharacterTheme(savedCharacterTheme);
    if (savedPortalIntensity) setPortalIntensity(savedPortalIntensity);
  }, []);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply base theme (dark/light)
    root.setAttribute('data-theme', theme);
    
    // Apply character theme colors
    root.setAttribute('data-character-theme', characterTheme);
    
    // Apply portal intensity
    root.setAttribute('data-portal-intensity', portalIntensity);
    
    // Save to localStorage
    localStorage.setItem('rickmorty-theme', theme);
    localStorage.setItem('rickmorty-character-theme', characterTheme);
    localStorage.setItem('rickmorty-portal-intensity', portalIntensity);
  }, [theme, characterTheme, portalIntensity]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const changeCharacterTheme = (newTheme) => {
    setCharacterTheme(newTheme);
  };

  const changePortalIntensity = (intensity) => {
    setPortalIntensity(intensity);
  };

  const value = {
    theme,
    characterTheme,
    portalIntensity,
    toggleTheme,
    changeCharacterTheme,
    changePortalIntensity
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

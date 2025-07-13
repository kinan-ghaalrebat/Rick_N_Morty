import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeSettings.css';

const ThemeSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    theme, 
    characterTheme, 
    portalIntensity, 
    toggleTheme, 
    changeCharacterTheme, 
    changePortalIntensity 
  } = useTheme();

  const characterThemes = [
    { id: 'default', name: 'Default', color: '#44BCBC' },
    { id: 'rick', name: 'Rick', color: '#0098DA' },
    { id: 'morty', name: 'Morty', color: '#F5E623' },
    { id: 'summer', name: 'Summer', color: '#FF6B9D' },
    { id: 'beth', name: 'Beth', color: '#FF8C42' },
    { id: 'jerry', name: 'Jerry', color: '#8FBC8F' }
  ];

  const portalIntensities = [
    { id: 'low', name: 'Subtle', description: 'Minimal effects' },
    { id: 'medium', name: 'Normal', description: 'Balanced animations' },
    { id: 'high', name: 'Intense', description: 'Full portal power!' }
  ];

  return (
    <>
      {/* Settings Toggle Button */}
      <button 
        className="theme-settings-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Theme Settings"
      >
        <div className="settings-icon">
          <div className="gear-outer"></div>
          <div className="gear-inner"></div>
        </div>
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="theme-settings-overlay" onClick={() => setIsOpen(false)}>
          <div className="theme-settings-panel" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h2>Portal Settings</h2>
              <button 
                className="close-settings"
                onClick={() => setIsOpen(false)}
              >
                ✖
              </button>
            </div>
            
            <div className="settings-content">
              {/* Theme Toggle */}
              <div className="setting-group">
                <h3>Display Mode</h3>
                <div className="theme-toggle-container">
                  <button 
                    className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => theme !== 'dark' && toggleTheme()}
                  >
                    <div className="theme-preview dark-preview"></div>
                    <span>Dark</span>
                  </button>
                  <button 
                    className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => theme !== 'light' && toggleTheme()}
                  >
                    <div className="theme-preview light-preview"></div>
                    <span>Light</span>
                  </button>
                </div>
              </div>

              {/* Character Theme */}
              <div className="setting-group">
                <h3>Character Theme</h3>
                <div className="character-themes">
                  {characterThemes.map((charTheme) => (
                    <button
                      key={charTheme.id}
                      className={`character-theme-option ${characterTheme === charTheme.id ? 'active' : ''}`}
                      onClick={() => changeCharacterTheme(charTheme.id)}
                      style={{ '--theme-color': charTheme.color }}
                    >
                      <div className="character-color" style={{ backgroundColor: charTheme.color }}></div>
                      <span>{charTheme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Portal Intensity */}
              <div className="setting-group">
                <h3>Portal Effects</h3>
                <div className="portal-intensity-options">
                  {portalIntensities.map((intensity) => (
                    <button
                      key={intensity.id}
                      className={`intensity-option ${portalIntensity === intensity.id ? 'active' : ''}`}
                      onClick={() => changePortalIntensity(intensity.id)}
                    >
                      <div className="intensity-header">
                        <span className="intensity-name">{intensity.name}</span>
                        <div className={`intensity-indicator ${intensity.id}`}></div>
                      </div>
                      <span className="intensity-description">{intensity.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <div className="setting-group">
                <button 
                  className="reset-settings-btn"
                  onClick={() => {
                    changeCharacterTheme('default');
                    changePortalIntensity('medium');
                    if (theme === 'light') toggleTheme();
                  }}
                >
                  🔄 Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeSettings;

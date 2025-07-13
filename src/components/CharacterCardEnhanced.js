import React, { useState } from 'react';
import './CharacterCardEnhanced.css';

const CharacterCardEnhanced = ({ character, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const quotes = {
    1: "Wubba lubba dub dub!", // Rick
    2: "Aw geez, Rick!", // Morty
    3: "I'm not a hero, I'm a predator!", // Summer (example)
    4: "I don't get paid enough for this.", // Beth (example)
    5: "put these seeds way up inside your butthole." // Rick (example)
  };

  const getRandomQuote = (characterId) => {
    const characterQuotes = quotes[characterId];
    if (characterQuotes) {
      return Array.isArray(characterQuotes) ? 
        characterQuotes[Math.floor(Math.random() * characterQuotes.length)] : 
        characterQuotes;
    }
    return "Welcome to the multiverse!";
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Alive': '💚',
      'Dead': '💀',
      'unknown': '❓'
    };
    return icons[status] || '❓';
  };

  return (
    <div 
      className={`character-card-enhanced ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Background Portal Effect */}
      <div className="card-portal-bg"></div>
      
      {/* Floating Particles */}
      <div className="floating-particles-card">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>

      {/* Character Image Container */}
      <div className="character-image-container-enhanced">
        <img src={character.image} alt={character.name} />
        
        {/* Holographic Overlay */}
        <div className="holographic-overlay"></div>
        
        {/* Status Badge */}
        <div className="status-badge-enhanced">
          <span className={`status-indicator ${character.status.toLowerCase()}`}>
            {getStatusIcon(character.status)}
          </span>
        </div>

        {/* Dimensional Border */}
        <div className="dimensional-border"></div>
      </div>
      
      {/* Character Content */}
      <div className="character-content-enhanced">
        <h3 className="character-name-enhanced">{character.name}</h3>
        
        {/* Quote Bubble - appears on hover */}
        <div className={`quote-bubble ${isHovered ? 'visible' : ''}`}>
          <div className="quote-text">"{getRandomQuote(character.id)}"</div>
          <div className="quote-pointer"></div>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="character-footer-enhanced">
        <button className="view-character-btn-enhanced">
          <span className="btn-text">View Character</span>
          <div className="btn-portal-effect"></div>
        </button>
      </div>

      {/* Hover Glow Effect */}
      <div className="hover-glow"></div>
    </div>
  );
};

export default CharacterCardEnhanced;

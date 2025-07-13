import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CharacterCardEnhanced from './CharacterCardEnhanced';
import './HomePage.css';

const HomePage = () => {
  const [featuredCharacters, setFeaturedCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch featured characters (Rick, Morty, and a few others)
    const fetchFeaturedCharacters = async () => {
      try {
        const response = await fetch('https://rickandmortyapi.com/api/character/1,2,3,4,5');
        const data = await response.json();
        setFeaturedCharacters(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching characters:', error);
        setLoading(false);
      }
    };

    fetchFeaturedCharacters();
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCharacterClick = (character) => {
    // Navigate to characters page with character ID (future enhancement)
    navigate('/characters');
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="portal-bg" style={{ transform: `translateY(${scrollY * 0.5}px)` }}></div>
        
        {/* Floating Portal Left */}
        <div className="floating-portal-left" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <div className="portal-outer-ring"></div>
          <div className="portal-middle-ring"></div>
          <div className="portal-inner-core"></div>
          <div className="portal-energy"></div>
        </div>
        
        {/* Stars Background Right */}
        <div className="stars-container" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
          <div className="star star-1"></div>
          <div className="star star-2"></div>
          <div className="star star-3"></div>
          <div className="star star-4"></div>
          <div className="star star-5"></div>
          <div className="star star-6"></div>
          <div className="star star-7"></div>
          <div className="star star-8"></div>
        </div>
        
        <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
          <h1 className="hero-title">
            <span className="rick-text">Rick</span>
            <span className="and-text">&</span>
            <span className="morty-text">Morty</span>
          </h1>
          <p className="hero-subtitle">
            Explore the infinite multiverse of Rick and Morty
          </p>
          <div className="hero-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/characters')}
            >
              Explore Characters
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/episodes')}
            >
              View Episodes
            </button>
            <button 
              className="btn btn-tertiary"
              onClick={() => navigate('/locations')}
            >
              Explore Locations
            </button>
          </div>
        </div>
        <div className="floating-particles"></div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">826</div>
              <div className="stat-label">Characters</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">126</div>
              <div className="stat-label">Locations</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">51</div>
              <div className="stat-label">Episodes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Characters Section */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Meet the Main Characters</h2>
          {loading ? (
            <div className="loading-portal">
              <div className="portal-loader"></div>
              <p>Opening portal...</p>
            </div>
          ) : (
            <div className="characters-grid">
              {featuredCharacters.map((character) => (
                <CharacterCardEnhanced
                  key={character.id}
                  character={character}
                  onClick={() => handleCharacterClick(character)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Explore the Multiverse</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👨‍🔬</div>
              <h3>Characters</h3>
              <p>Discover all 826 characters from across dimensions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Locations</h3>
              <p>Explore 126 unique locations and dimensions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📺</div>
              <h3>Episodes</h3>
              <p>Browse through all 51 episodes with detailed info</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

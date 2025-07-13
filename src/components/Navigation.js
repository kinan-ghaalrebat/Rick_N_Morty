import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-rick">Rick</span>
          <span className="logo-and">&</span>
          <span className="logo-morty">Morty</span>
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/characters" 
            className={`nav-link ${location.pathname === '/characters' ? 'active' : ''}`}
          >
            Characters
          </Link>
          <Link 
            to="/episodes" 
            className={`nav-link ${location.pathname === '/episodes' ? 'active' : ''}`}
          >
            Episodes
          </Link>
          <Link 
            to="/locations" 
            className={`nav-link ${location.pathname === '/locations' ? 'active' : ''}`}
          >
            Locations
          </Link>
        </div>
        
        <div className="nav-portal">
          <div className="mini-portal"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import EpisodesPage from './components/EpisodesPage';
import LocationsPage from './components/LocationsPage';
import CharactersPage from './components/CharactersPage';
import ThemeSettings from './components/ThemeSettings';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navigation />
          <ThemeSettings />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/characters" element={<CharactersPage />} />
              <Route path="/episodes" element={<EpisodesPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              {/* Add more routes later */}
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

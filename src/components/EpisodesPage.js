import React, { useState, useEffect } from 'react';
import './EpisodesPage.css';

const EpisodesPage = () => {
  const [episodes, setEpisodes] = useState([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [episodesPerPage] = useState(9); // Show 9 episodes per page
  
  // Modal state
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [episodeCharacters, setEpisodeCharacters] = useState([]);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [charactersPerPage] = useState(8);
  const [loadingCharacters, setLoadingCharacters] = useState(false);

  useEffect(() => {
    fetchAllEpisodes();
  }, []);

  useEffect(() => {
    filterEpisodes();
    setCurrentPage(1); // Reset to first page when filters change
  }, [episodes, searchTerm, selectedSeason]);

  const fetchAllEpisodes = async () => {
    try {
      setLoading(true);
      let allEpisodes = [];
      let page = 1;
      let hasNextPage = true;

      // Fetch all episodes from all pages
      while (hasNextPage) {
        const response = await fetch(`https://rickandmortyapi.com/api/episode?page=${page}`);
        const data = await response.json();
        
        allEpisodes = [...allEpisodes, ...data.results];
        
        hasNextPage = data.info.next !== null;
        page++;
      }
      
      setEpisodes(allEpisodes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      setLoading(false);
    }
  };

  const filterEpisodes = () => {
    let filtered = episodes.filter(episode => 
      episode.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      episode.episode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedSeason !== 'all') {
      filtered = filtered.filter(episode => 
        episode.episode.startsWith(`S${selectedSeason.padStart(2, '0')}`)
      );
    }

    setFilteredEpisodes(filtered);
  };

  const getSeasonFromEpisode = (episodeCode) => {
    return episodeCode.match(/S(\d+)/)?.[1] || '1';
  };

  const getEpisodeNumber = (episodeCode) => {
    return episodeCode.match(/E(\d+)/)?.[1] || '1';
  };

  const getAvailableSeasons = () => {
    const seasonsSet = new Set();
    episodes.forEach(episode => {
      const season = getSeasonFromEpisode(episode.episode);
      seasonsSet.add(season);
    });
    return ['all', ...Array.from(seasonsSet).sort((a, b) => parseInt(a) - parseInt(b))];
  };

  // Pagination logic
  const getTotalPages = () => {
    return Math.ceil(filteredEpisodes.length / episodesPerPage);
  };

  const getCurrentPageEpisodes = () => {
    // Only use pagination for "All Seasons", show all episodes for specific seasons
    if (selectedSeason === 'all') {
      const startIndex = (currentPage - 1) * episodesPerPage;
      const endIndex = startIndex + episodesPerPage;
      return filteredEpisodes.slice(startIndex, endIndex);
    } else {
      // Show all episodes for specific seasons without pagination
      return filteredEpisodes;
    }
  };

  const goToNextPage = () => {
    if (currentPage < getTotalPages()) {
      setCurrentPage(prev => prev + 1);
      scrollToEpisodes();
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      scrollToEpisodes();
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= getTotalPages()) {
      setCurrentPage(pageNumber);
      scrollToEpisodes();
    }
  };

  const scrollToEpisodes = () => {
    const episodesSection = document.querySelector('.episodes-grid-section');
    if (episodesSection) {
      episodesSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Modal functions
  const openEpisodeModal = async (episode) => {
    setSelectedEpisode(episode);
    setModalOpen(true);
    setModalCurrentPage(1);
    setEpisodeCharacters([]);
    
    // Fetch character details
    if (episode.characters && episode.characters.length > 0) {
      await fetchCharactersPage(episode.characters, 1);
    }
  };

  const fetchCharactersPage = async (allCharacterUrls, page) => {
    try {
      setLoadingCharacters(true);
      
      // Calculate which characters to fetch for this page
      const startIndex = (page - 1) * charactersPerPage;
      const endIndex = startIndex + charactersPerPage;
      const pageCharacterUrls = allCharacterUrls.slice(startIndex, endIndex);
      
      if (pageCharacterUrls.length > 0) {
        const characterPromises = pageCharacterUrls.map(url => 
          fetch(url).then(res => res.json())
        );
        const characters = await Promise.all(characterPromises);
        setEpisodeCharacters(characters);
      } else {
        setEpisodeCharacters([]);
      }
      
      setLoadingCharacters(false);
    } catch (error) {
      console.error('Error fetching characters:', error);
      setEpisodeCharacters([]);
      setLoadingCharacters(false);
    }
  };

  const closeEpisodeModal = () => {
    setModalOpen(false);
    setSelectedEpisode(null);
    setEpisodeCharacters([]);
    setModalCurrentPage(1);
  };

  // Modal pagination functions
  const getEpisodeModalTotalPages = () => {
    if (!selectedEpisode) return 0;
    return Math.ceil(selectedEpisode.characters.length / charactersPerPage);
  };

  const goToEpisodeModalNextPage = () => {
    const totalPages = getEpisodeModalTotalPages();
    if (modalCurrentPage < totalPages) {
      const nextPage = modalCurrentPage + 1;
      setModalCurrentPage(nextPage);
      fetchCharactersPage(selectedEpisode.characters, nextPage);
    }
  };

  const goToEpisodeModalPrevPage = () => {
    if (modalCurrentPage > 1) {
      const prevPage = modalCurrentPage - 1;
      setModalCurrentPage(prevPage);
      fetchCharactersPage(selectedEpisode.characters, prevPage);
    }
  };

  const goToEpisodeModalPage = (pageNumber) => {
    const totalPages = getEpisodeModalTotalPages();
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setModalCurrentPage(pageNumber);
      fetchCharactersPage(selectedEpisode.characters, pageNumber);
    }
  };

  const seasons = getAvailableSeasons();

  return (
    <div className="episodes-page">
      {/* Header Section */}
      <section className="episodes-header">
        <div className="portal-bg-episodes"></div>
        <div className="container">
          <h1 className="page-title">
            <span className="episodes-text">Episodes</span>
          </h1>
          <p className="page-subtitle">
            Journey through all 51 episodes across the multiverse
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search episodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="search-icon">🔍</div>
            </div>
            
            <div className="season-filter">
              <label htmlFor="season-select">Season:</label>
              <select
                id="season-select"
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="season-select"
              >
                <option value="all">All Seasons</option>
                {seasons.slice(1).map(season => (
                  <option key={season} value={season}>Season {season}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="results-count">
            Showing {getCurrentPageEpisodes().length} of {filteredEpisodes.length} episodes
            {getTotalPages() > 1 && selectedSeason === 'all' && (
              <span> • Page {currentPage} of {getTotalPages()}</span>
            )}
          </div>
        </div>
      </section>

      {/* Episodes Grid Section */}
      <section className="episodes-grid-section">
        <div className="container">
          {loading ? (
            <div className="loading-portal">
              <div className="portal-loader"></div>
              <p>Loading episodes...</p>
            </div>
          ) : (
            <>
              <div className="episodes-grid">
                {getCurrentPageEpisodes().map((episode) => (
                  <div key={episode.id} className="episode-card">
                    <div className="episode-header">
                      <div className="episode-number">
                        <span className="season">S{getSeasonFromEpisode(episode.episode)}</span>
                        <span className="episode">E{getEpisodeNumber(episode.episode)}</span>
                      </div>
                      <div className="air-date">{episode.air_date}</div>
                    </div>
                    
                    <div className="episode-content">
                      <h3 className="episode-title">{episode.name}</h3>
                      <p className="episode-code">{episode.episode}</p>
                      <div className="characters-count">
                        👥 {episode.characters.length} characters
                      </div>
                    </div>
                    
                    <div className="episode-footer">
                      <button 
                        className="view-details-btn"
                        onClick={() => openEpisodeModal(episode)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {getTotalPages() > 1 && selectedSeason === 'all' && (
                <div className="pagination-container">
                  <button 
                    className="pagination-btn prev-btn"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  
                  <div className="pagination-info">
                    <div className="page-numbers">
                      {Array.from({ length: getTotalPages() }, (_, index) => {
                        const pageNum = index + 1;
                        // Show first page, last page, current page, and adjacent pages
                        if (
                          pageNum === 1 || 
                          pageNum === getTotalPages() || 
                          Math.abs(pageNum - currentPage) <= 1
                        ) {
                          return (
                            <button
                              key={pageNum}
                              className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                              onClick={() => goToPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === currentPage - 2 || 
                          pageNum === currentPage + 2
                        ) {
                          return <span key={pageNum} className="page-dots">...</span>;
                        }
                        return null;
                      })}
                    </div>
                  </div>
                  
                  <button 
                    className="pagination-btn next-btn"
                    onClick={goToNextPage}
                    disabled={currentPage === getTotalPages()}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Season Stats */}
      <section className="season-stats">
        <div className="container">
          <h2 className="section-title">Season Breakdown</h2>
          <div className="stats-grid">
            {seasons.slice(1).map(season => {
              const seasonEpisodes = episodes.filter(ep => 
                ep.episode.startsWith(`S${season.padStart(2, '0')}`)
              );
              return (
                <div key={season} className="season-stat-card">
                  <div className="season-number">Season {season}</div>
                  <div className="season-count">{seasonEpisodes.length} Episodes</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Episode Details Modal */}
      {modalOpen && selectedEpisode && (
        <div className="modal-overlay" onClick={closeEpisodeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEpisode.name}</h2>
              <button className="modal-close" onClick={closeEpisodeModal}>✖</button>
            </div>
            
            <div className="modal-body">
              <div className="episode-details">
                <div className="detail-item">
                  <span className="detail-label">Episode:</span>
                  <span className="detail-value">{selectedEpisode.episode}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Air Date:</span>
                  <span className="detail-value">📅 {selectedEpisode.air_date}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Characters:</span>
                  <span className="detail-value">👥 {selectedEpisode.characters.length} total</span>
                </div>
              </div>

              {episodeCharacters.length > 0 && (
                <div className="characters-section">
                  <h3>Featured Characters</h3>
                  <div className="characters-grid">
                    {episodeCharacters.map((character) => (
                      <div key={character.id} className="character-card">
                        <img src={character.image} alt={character.name} />
                        <div className="character-info">
                          <h4>{character.name}</h4>
                          <p className="character-species">{character.species}</p>
                          <span className={`character-status ${character.status.toLowerCase()}`}>
                            {character.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedEpisode.characters.length > 12 && (
                    <p className="more-characters">
                      +{selectedEpisode.characters.length - 12} more characters appear in this episode
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodesPage;

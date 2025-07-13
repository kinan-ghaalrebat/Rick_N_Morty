import React, { useState, useEffect } from 'react';
import './CharactersPage.css';

const CharactersPage = () => {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [charactersPerPage] = useState(20);
  
  // Modal state
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [characterEpisodes, setCharacterEpisodes] = useState([]);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [episodesPerPage] = useState(6);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  useEffect(() => {
    fetchAllCharacters();
  }, []);

  useEffect(() => {
    filterCharacters();
    setCurrentPage(1); // Reset to first page when filters change
  }, [characters, searchTerm, selectedStatus, selectedSpecies, selectedGender]);

  const fetchAllCharacters = async () => {
    try {
      setLoading(true);
      let allCharacters = [];
      let page = 1;
      let hasNextPage = true;

      // Fetch all characters from all pages
      while (hasNextPage) {
        const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
        const data = await response.json();
        
        allCharacters = [...allCharacters, ...data.results];
        
        hasNextPage = data.info.next !== null;
        page++;
      }
      
      setCharacters(allCharacters);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching characters:', error);
      setLoading(false);
    }
  };

  const filterCharacters = () => {
    let filtered = characters.filter(character => 
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.origin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.location.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(character => 
        character.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    if (selectedSpecies !== 'all') {
      filtered = filtered.filter(character => 
        character.species.toLowerCase() === selectedSpecies.toLowerCase()
      );
    }

    if (selectedGender !== 'all') {
      filtered = filtered.filter(character => 
        character.gender.toLowerCase() === selectedGender.toLowerCase()
      );
    }

    setFilteredCharacters(filtered);
  };

  const getAvailableStatuses = () => {
    const statusesSet = new Set();
    characters.forEach(character => {
      statusesSet.add(character.status);
    });
    return ['all', ...Array.from(statusesSet).sort()];
  };

  const getAvailableSpecies = () => {
    const speciesSet = new Set();
    characters.forEach(character => {
      speciesSet.add(character.species);
    });
    return ['all', ...Array.from(speciesSet).sort().slice(0, 15)]; // Limit to 15 most common
  };

  const getAvailableGenders = () => {
    const gendersSet = new Set();
    characters.forEach(character => {
      gendersSet.add(character.gender);
    });
    return ['all', ...Array.from(gendersSet).sort()];
  };

  // Pagination logic
  const getTotalPages = () => {
    return Math.ceil(filteredCharacters.length / charactersPerPage);
  };

  const getCurrentPageCharacters = () => {
    const startIndex = (currentPage - 1) * charactersPerPage;
    const endIndex = startIndex + charactersPerPage;
    return filteredCharacters.slice(startIndex, endIndex);
  };

  const goToNextPage = () => {
    if (currentPage < getTotalPages()) {
      setCurrentPage(prev => prev + 1);
      scrollToCharacters();
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      scrollToCharacters();
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= getTotalPages()) {
      setCurrentPage(pageNumber);
      scrollToCharacters();
    }
  };

  const scrollToCharacters = () => {
    const charactersSection = document.querySelector('.characters-grid-section');
    if (charactersSection) {
      charactersSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      'Alive': '💚',
      'Dead': '💀',
      'unknown': '❓'
    };
    return statusIcons[status] || '❓';
  };

  const getSpeciesIcon = (species) => {
    const speciesIcons = {
      'Human': '👤',
      'Alien': '👽',
      'Robot': '🤖',
      'Animal': '🐾',
      'Cronenberg': '🧟',
      'Disease': '🦠',
      'Humanoid': '👥',
      'Mythological Creature': '🧙',
      'Poopybutthole': '💩',
      'unknown': '❓'
    };
    return speciesIcons[species] || '🧬';
  };

  // Modal functions
  const openCharacterModal = async (character) => {
    setSelectedCharacter(character);
    setModalOpen(true);
    setModalCurrentPage(1);
    setCharacterEpisodes([]);
    
    // Fetch episode details if there are episodes
    if (character.episode && character.episode.length > 0) {
      await fetchEpisodesPage(character.episode, 1);
    }
  };

  const fetchEpisodesPage = async (allEpisodeUrls, page) => {
    try {
      setLoadingEpisodes(true);
      
      // Calculate which episodes to fetch for this page
      const startIndex = (page - 1) * episodesPerPage;
      const endIndex = startIndex + episodesPerPage;
      const pageEpisodeUrls = allEpisodeUrls.slice(startIndex, endIndex);
      
      if (pageEpisodeUrls.length > 0) {
        const episodePromises = pageEpisodeUrls.map(url => 
          fetch(url).then(res => res.json())
        );
        const episodes = await Promise.all(episodePromises);
        setCharacterEpisodes(episodes);
      } else {
        setCharacterEpisodes([]);
      }
      
      setLoadingEpisodes(false);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      setCharacterEpisodes([]);
      setLoadingEpisodes(false);
    }
  };

  const closeCharacterModal = () => {
    setModalOpen(false);
    setSelectedCharacter(null);
    setCharacterEpisodes([]);
    setModalCurrentPage(1);
  };

  // Modal pagination functions
  const getModalTotalPages = () => {
    if (!selectedCharacter) return 0;
    return Math.ceil(selectedCharacter.episode.length / episodesPerPage);
  };

  const goToModalNextPage = () => {
    const totalPages = getModalTotalPages();
    if (modalCurrentPage < totalPages) {
      const nextPage = modalCurrentPage + 1;
      setModalCurrentPage(nextPage);
      fetchEpisodesPage(selectedCharacter.episode, nextPage);
    }
  };

  const goToModalPrevPage = () => {
    if (modalCurrentPage > 1) {
      const prevPage = modalCurrentPage - 1;
      setModalCurrentPage(prevPage);
      fetchEpisodesPage(selectedCharacter.episode, prevPage);
    }
  };

  const goToModalPage = (pageNumber) => {
    const totalPages = getModalTotalPages();
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setModalCurrentPage(pageNumber);
      fetchEpisodesPage(selectedCharacter.episode, pageNumber);
    }
  };

  const getSeasonFromEpisode = (episodeCode) => {
    return episodeCode.match(/S(\d+)/)?.[1] || '1';
  };

  const getEpisodeNumber = (episodeCode) => {
    return episodeCode.match(/E(\d+)/)?.[1] || '1';
  };

  const statuses = getAvailableStatuses();
  const species = getAvailableSpecies();
  const genders = getAvailableGenders();

  return (
    <div className="characters-page">
      {/* Header Section */}
      <section className="characters-header">
        <div className="portal-bg-characters"></div>
        <div className="container">
          <h1 className="page-title">
            <span className="characters-text">Characters</span>
          </h1>
          <p className="page-subtitle">
            Meet all 826 characters from across the multiverse
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
                placeholder="Search characters, species, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="search-icon">🔍</div>
            </div>
            
            <div className="filter-group">
              <div className="status-filter">
                <label htmlFor="status-select">Status:</label>
                <select
                  id="status-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  {statuses.slice(1).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div className="species-filter">
                <label htmlFor="species-select">Species:</label>
                <select
                  id="species-select"
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Species</option>
                  {species.slice(1).map(specie => (
                    <option key={specie} value={specie}>{specie}</option>
                  ))}
                </select>
              </div>

              <div className="gender-filter">
                <label htmlFor="gender-select">Gender:</label>
                <select
                  id="gender-select"
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Genders</option>
                  {genders.slice(1).map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="results-count">
            Showing {getCurrentPageCharacters().length} of {filteredCharacters.length} characters
            {getTotalPages() > 1 && (
              <span> • Page {currentPage} of {getTotalPages()}</span>
            )}
          </div>
        </div>
      </section>

      {/* Characters Grid Section */}
      <section className="characters-grid-section">
        <div className="container">
          {loading ? (
            <div className="loading-portal">
              <div className="portal-loader"></div>
              <p>Loading characters...</p>
            </div>
          ) : (
            <>
              <div className="characters-grid">
                {getCurrentPageCharacters().map((character) => (
                  <div key={character.id} className="character-card">
                    <div className="character-image-container">
                      <img src={character.image} alt={character.name} />
                    </div>
                    
                    <div className="character-content">
                      <h3 className="character-name">{character.name}</h3>
                    </div>
                    
                    <div className="character-footer">
                      <button 
                        className="view-details-btn"
                        onClick={() => openCharacterModal(character)}
                      >
                        View Character
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {getTotalPages() > 1 && (
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

      {/* Stats Section */}
      <section className="character-stats">
        <div className="container">
          <h2 className="section-title">Character Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💚</div>
              <div className="stat-number">{characters.filter(c => c.status === 'Alive').length}</div>
              <div className="stat-label">Alive</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💀</div>
              <div className="stat-number">{characters.filter(c => c.status === 'Dead').length}</div>
              <div className="stat-label">Dead</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👤</div>
              <div className="stat-number">{characters.filter(c => c.species === 'Human').length}</div>
              <div className="stat-label">Humans</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👽</div>
              <div className="stat-number">{characters.filter(c => c.species === 'Alien').length}</div>
              <div className="stat-label">Aliens</div>
            </div>
          </div>
        </div>
      </section>

      {/* Character Details Modal */}
      {modalOpen && selectedCharacter && (
        <div className="modal-overlay" onClick={closeCharacterModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCharacter.name}</h2>
              <button className="modal-close" onClick={closeCharacterModal}>✖</button>
            </div>
            
            <div className="modal-body">
              <div className="character-modal-info">
                <div className="character-image-section">
                  <img src={selectedCharacter.image} alt={selectedCharacter.name} />
                  <div className="character-status">
                    <span className={`status-badge ${selectedCharacter.status.toLowerCase()}`}>
                      {getStatusIcon(selectedCharacter.status)} {selectedCharacter.status}
                    </span>
                  </div>
                </div>
                
                <div className="character-details">
                  <div className="detail-item">
                    <span className="detail-label">Species:</span>
                    <span className="detail-value">
                      {getSpeciesIcon(selectedCharacter.species)} {selectedCharacter.species}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Gender:</span>
                    <span className="detail-value">{selectedCharacter.gender}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Origin:</span>
                    <span className="detail-value">🌍 {selectedCharacter.origin.name}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Current Location:</span>
                    <span className="detail-value">📍 {selectedCharacter.location.name}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Total Episodes:</span>
                    <span className="detail-value">📺 {selectedCharacter.episode.length} appearances</span>
                  </div>
                </div>
              </div>

              {selectedCharacter.episode.length > 0 && (
                <div className="episodes-section">
                  <div className="episodes-header">
                    <h3>Episode Appearances</h3>
                    <div className="episodes-pagination-info">
                      Showing {((modalCurrentPage - 1) * episodesPerPage) + 1}-{Math.min(modalCurrentPage * episodesPerPage, selectedCharacter.episode.length)} of {selectedCharacter.episode.length}
                    </div>
                  </div>
                  
                  {loadingEpisodes ? (
                    <div className="modal-loading">
                      <div className="portal-loader-small"></div>
                      <p>Loading episodes...</p>
                    </div>
                  ) : (
                    <>
                      <div className="episodes-grid">
                        {characterEpisodes.map((episode) => (
                          <div key={episode.id} className="episode-card-modal">
                            <div className="episode-number">
                              <span className="season">S{getSeasonFromEpisode(episode.episode)}</span>
                              <span className="episode">E{getEpisodeNumber(episode.episode)}</span>
                            </div>
                            <div className="episode-info">
                              <h4>{episode.name}</h4>
                              <p className="air-date">{episode.air_date}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Modal Pagination Controls */}
                      {getModalTotalPages() > 1 && (
                        <div className="modal-pagination-container">
                          <button 
                            className="modal-pagination-btn"
                            onClick={goToModalPrevPage}
                            disabled={modalCurrentPage === 1}
                          >
                            Previous
                          </button>
                          
                          <div className="modal-pagination-info">
                            <div className="modal-page-numbers">
                              {Array.from({ length: getModalTotalPages() }, (_, index) => {
                                const pageNum = index + 1;
                                if (
                                  pageNum === 1 || 
                                  pageNum === getModalTotalPages() || 
                                  Math.abs(pageNum - modalCurrentPage) <= 1
                                ) {
                                  return (
                                    <button
                                      key={pageNum}
                                      className={`modal-page-number ${modalCurrentPage === pageNum ? 'active' : ''}`}
                                      onClick={() => goToModalPage(pageNum)}
                                    >
                                      {pageNum}
                                    </button>
                                  );
                                } else if (
                                  pageNum === modalCurrentPage - 2 || 
                                  pageNum === modalCurrentPage + 2
                                ) {
                                  return <span key={pageNum} className="modal-page-dots">...</span>;
                                }
                                return null;
                              })}
                            </div>
                          </div>
                          
                          <button 
                            className="modal-pagination-btn"
                            onClick={goToModalNextPage}
                            disabled={modalCurrentPage === getModalTotalPages()}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
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

export default CharactersPage;

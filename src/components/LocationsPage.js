import React, { useState, useEffect } from 'react';
import './LocationsPage.css';

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDimension, setSelectedDimension] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [locationsPerPage] = useState(12);
  
  // Modal state
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [locationResidents, setLocationResidents] = useState([]);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [residentsPerPage] = useState(8);
  const [loadingResidents, setLoadingResidents] = useState(false); // Show 12 locations per page

  useEffect(() => {
    fetchAllLocations();
  }, []);

  useEffect(() => {
    filterLocations();
    setCurrentPage(1); // Reset to first page when filters change
  }, [locations, searchTerm, selectedType, selectedDimension]);

  const fetchAllLocations = async () => {
    try {
      setLoading(true);
      let allLocations = [];
      let page = 1;
      let hasNextPage = true;

      // Fetch all locations from all pages
      while (hasNextPage) {
        const response = await fetch(`https://rickandmortyapi.com/api/location?page=${page}`);
        const data = await response.json();
        
        allLocations = [...allLocations, ...data.results];
        
        hasNextPage = data.info.next !== null;
        page++;
      }
      
      setLocations(allLocations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLoading(false);
    }
  };

  const filterLocations = () => {
    let filtered = locations.filter(location => 
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.dimension.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedType !== 'all') {
      filtered = filtered.filter(location => 
        location.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    if (selectedDimension !== 'all') {
      filtered = filtered.filter(location => 
        location.dimension.toLowerCase().includes(selectedDimension.toLowerCase())
      );
    }

    setFilteredLocations(filtered);
  };

  const getAvailableTypes = () => {
    const typesSet = new Set();
    locations.forEach(location => {
      typesSet.add(location.type);
    });
    return ['all', ...Array.from(typesSet).sort()];
  };

  const getAvailableDimensions = () => {
    const dimensionsSet = new Set();
    locations.forEach(location => {
      if (location.dimension && location.dimension !== 'unknown') {
        dimensionsSet.add(location.dimension);
      }
    });
    return ['all', ...Array.from(dimensionsSet).sort()];
  };

  // Pagination logic
  const getTotalPages = () => {
    return Math.ceil(filteredLocations.length / locationsPerPage);
  };

  const getCurrentPageLocations = () => {
    const startIndex = (currentPage - 1) * locationsPerPage;
    const endIndex = startIndex + locationsPerPage;
    return filteredLocations.slice(startIndex, endIndex);
  };

  const goToNextPage = () => {
    if (currentPage < getTotalPages()) {
      setCurrentPage(prev => prev + 1);
      scrollToLocations();
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      scrollToLocations();
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= getTotalPages()) {
      setCurrentPage(pageNumber);
      scrollToLocations();
    }
  };

  const scrollToLocations = () => {
    const locationsSection = document.querySelector('.locations-grid-section');
    if (locationsSection) {
      locationsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const getLocationIcon = (type) => {
    const typeIcons = {
      'Planet': '🪐',
      'Space station': '🛰️',
      'Dimension': '🌌',
      'Microverse': '🔬',
      'TV': '📺',
      'Resort': '🏖️',
      'Fantasy town': '🏰',
      'Dream': '💭',
      'Menagerie': '🦁',
      'Game': '🎮',
      'Customs': '🛃',
      'Daycare': '🧸',
      'Dwarf planet': '☄️',
      'Miniverse': '🔬',
      'Teenyverse': '🧲',
      'Box': '📦',
      'Spacecraft': '🚀',
      'Cluster': '⭐',
      'Base': '🏗️',
      'Acid Plant': '🧪',
      'Citadel': '🏛️',
      'Memory': '🧠',
      'Machine': '⚙️',
      'Arcade': '🕹️',
      'Spa': '🧘',
      'Quadrant': '🗺️',
      'Quasar': '✨',
      'Mount': '⛰️',
      'Liquid': '💧'
    };
    return typeIcons[type] || '📍';
  };

  // Modal functions
  const openLocationModal = async (location) => {
    setSelectedLocation(location);
    setModalOpen(true);
    setModalCurrentPage(1);
    setLocationResidents([]);
    
    // Fetch resident details if there are residents
    if (location.residents && location.residents.length > 0) {
      await fetchResidentsPage(location.residents, 1);
    }
  };

  const fetchResidentsPage = async (allResidentUrls, page) => {
    try {
      setLoadingResidents(true);
      
      // Calculate which residents to fetch for this page
      const startIndex = (page - 1) * residentsPerPage;
      const endIndex = startIndex + residentsPerPage;
      const pageResidentUrls = allResidentUrls.slice(startIndex, endIndex);
      
      if (pageResidentUrls.length > 0) {
        const residentPromises = pageResidentUrls.map(url => 
          fetch(url).then(res => res.json())
        );
        const residents = await Promise.all(residentPromises);
        setLocationResidents(residents);
      } else {
        setLocationResidents([]);
      }
      
      setLoadingResidents(false);
    } catch (error) {
      console.error('Error fetching residents:', error);
      setLocationResidents([]);
      setLoadingResidents(false);
    }
  };

  const closeLocationModal = () => {
    setModalOpen(false);
    setSelectedLocation(null);
    setLocationResidents([]);
    setModalCurrentPage(1);
  };

  // Modal pagination functions
  const getModalTotalPages = () => {
    if (!selectedLocation) return 0;
    return Math.ceil(selectedLocation.residents.length / residentsPerPage);
  };

  const goToModalNextPage = () => {
    const totalPages = getModalTotalPages();
    if (modalCurrentPage < totalPages) {
      const nextPage = modalCurrentPage + 1;
      setModalCurrentPage(nextPage);
      fetchResidentsPage(selectedLocation.residents, nextPage);
    }
  };

  const goToModalPrevPage = () => {
    if (modalCurrentPage > 1) {
      const prevPage = modalCurrentPage - 1;
      setModalCurrentPage(prevPage);
      fetchResidentsPage(selectedLocation.residents, prevPage);
    }
  };

  const goToModalPage = (pageNumber) => {
    const totalPages = getModalTotalPages();
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setModalCurrentPage(pageNumber);
      fetchResidentsPage(selectedLocation.residents, pageNumber);
    }
  };

  const types = getAvailableTypes();
  const dimensions = getAvailableDimensions();

  return (
    <div className="locations-page">
      {/* Header Section */}
      <section className="locations-header">
        <div className="portal-bg-locations"></div>
        <div className="container">
          <h1 className="page-title">
            <span className="locations-text">Locations</span>
          </h1>
          <p className="page-subtitle">
            Explore 126 unique locations across infinite dimensions
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
                placeholder="Search locations, types, or dimensions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="search-icon">🔍</div>
            </div>
            
            <div className="filter-group">
              <div className="type-filter">
                <label htmlFor="type-select">Type:</label>
                <select
                  id="type-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Types</option>
                  {types.slice(1).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="dimension-filter">
                <label htmlFor="dimension-select">Dimension:</label>
                <select
                  id="dimension-select"
                  value={selectedDimension}
                  onChange={(e) => setSelectedDimension(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Dimensions</option>
                  {dimensions.slice(1).slice(0, 10).map(dimension => (
                    <option key={dimension} value={dimension}>
                      {dimension.length > 20 ? `${dimension.substring(0, 20)}...` : dimension}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="results-count">
            Showing {getCurrentPageLocations().length} of {filteredLocations.length} locations
            {getTotalPages() > 1 && (
              <span> • Page {currentPage} of {getTotalPages()}</span>
            )}
          </div>
        </div>
      </section>

      {/* Locations Grid Section */}
      <section className="locations-grid-section">
        <div className="container">
          {loading ? (
            <div className="loading-portal">
              <div className="portal-loader"></div>
              <p>Loading locations...</p>
            </div>
          ) : (
            <>
              <div className="locations-grid">
                {getCurrentPageLocations().map((location) => (
                  <div key={location.id} className="location-card">
                    <div className="location-header">
                      <div className="location-icon">
                        {getLocationIcon(location.type)}
                      </div>
                      <div className="location-type">{location.type}</div>
                    </div>
                    
                    <div className="location-content">
                      <h3 className="location-name">{location.name}</h3>
                      <p className="location-dimension">
                        <span className="dimension-label">Dimension:</span>
                        <span className="dimension-value">
                          {location.dimension === 'unknown' ? 'Unknown' : location.dimension}
                        </span>
                      </p>
                      <div className="residents-count">
                        👥 {location.residents.length} residents
                      </div>
                    </div>
                    
                    <div className="location-footer">
                      <button 
                        className="view-details-btn"
                        onClick={() => openLocationModal(location)}
                      >
                        Explore Location
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
      <section className="location-stats">
        <div className="container">
          <h2 className="section-title">Location Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🪐</div>
              <div className="stat-number">{locations.filter(l => l.type === 'Planet').length}</div>
              <div className="stat-label">Planets</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🌌</div>
              <div className="stat-number">{locations.filter(l => l.type === 'Dimension').length}</div>
              <div className="stat-label">Dimensions</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🛰️</div>
              <div className="stat-number">{locations.filter(l => l.type === 'Space station').length}</div>
              <div className="stat-label">Space Stations</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📍</div>
              <div className="stat-number">{locations.length}</div>
              <div className="stat-label">Total Locations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Details Modal */}
      {modalOpen && selectedLocation && (
        <div className="modal-overlay" onClick={closeLocationModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedLocation.name}</h2>
              <button className="modal-close" onClick={closeLocationModal}>✖</button>
            </div>
            
            <div className="modal-body">
              <div className="location-details">
                <div className="detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">
                    {getLocationIcon(selectedLocation.type)} {selectedLocation.type}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Dimension:</span>
                  <span className="detail-value">
                    🌌 {selectedLocation.dimension === 'unknown' ? 'Unknown' : selectedLocation.dimension}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Total Residents:</span>
                  <span className="detail-value">
                    👥 {selectedLocation.residents.length} characters
                  </span>
                </div>
              </div>

              {selectedLocation.residents.length > 0 && (
                <div className="residents-section">
                  <div className="residents-header">
                    <h3>Residents</h3>
                    <div className="residents-pagination-info">
                      Showing {((modalCurrentPage - 1) * residentsPerPage) + 1}-{Math.min(modalCurrentPage * residentsPerPage, selectedLocation.residents.length)} of {selectedLocation.residents.length}
                    </div>
                  </div>
                  
                  {loadingResidents ? (
                    <div className="modal-loading">
                      <div className="portal-loader-small"></div>
                      <p>Loading residents...</p>
                    </div>
                  ) : (
                    <>
                      <div className="residents-grid">
                        {locationResidents.map((resident) => (
                          <div key={resident.id} className="resident-card">
                            <img src={resident.image} alt={resident.name} />
                            <div className="resident-info">
                              <h4>{resident.name}</h4>
                              <button className="view-character-btn">
                                View Character
                              </button>
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
                                // Show first, last, current, and adjacent pages
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

              {locationResidents.length === 0 && selectedLocation.residents.length === 0 && (
                <div className="no-residents">
                  <p>🏜️ This location has no known residents</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsPage;

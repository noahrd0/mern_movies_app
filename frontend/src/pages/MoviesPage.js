import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import MovieCard from '../components/movies/MovieCard';
import { MovieService } from '../services/api.js';

function MoviesPage({ allGenres }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilteredMovies = async () => {
      try {
        setLoading(true);
        const result = await MovieService.filter(searchTerm, genreFilter, currentPage);
        setFilteredMovies(result.movies);
        setTotalPages(result.pages);
      } catch (error) {
        console.error("Erreur lors du chargement des films filtrés :", error);
        setFilteredMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredMovies();
  }, [searchTerm, genreFilter, currentPage]);

  const renderPagination = () => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="pagination">
        {pages.map((page) => (
          <button
            key={page}
            className={`page-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="movies-page">
      <div className="search-filters">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un film ou un réalisateur..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to first page
            }}
          />
        </div>

        <div className="filter-section">
          <label className="filter-label">Filtrer par genre:</label>
          <select
            className="genre-filter"
            value={genreFilter}
            onChange={(e) => {
              setGenreFilter(e.target.value);
              setCurrentPage(1); // reset to first page
            }}
          >
            <option value="">Tous les genres</option>
            {allGenres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      <h2 className="section-title">Films populaires</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : filteredMovies.length > 0 ? (
        <>
          <div className="movies-grid">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {renderPagination()}
        </>
      ) : (
        <div className="no-results">
          <p>Aucun film ne correspond à votre recherche.</p>
        </div>
      )}
    </div>
  );
}

export default MoviesPage;

import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from '../components/movies/MovieCard';

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [allGenres, setAllGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État pour la pagination
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 24 // Nombre de films par page
  });
  
  // Charger les films avec pagination
  const loadMovies = useCallback(async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5001/api/movies?page=${pagination.page}&limit=${pagination.limit}`;
      
      if (searchTerm) {
        url = `http://localhost:5001/api/movies/search/${searchTerm}?page=${pagination.page}&limit=${pagination.limit}`;
      } else if (genreFilter) {
        url = `http://localhost:5001/api/movies/genre/${genreFilter}?page=${pagination.page}&limit=${pagination.limit}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des films');
      }
      
      const data = await response.json();
      const moviesData = data.movies || data; // Compatibilité avec le format de l'API
      
      // Transformer les données pour correspondre à notre structure
      const formattedMovies = Array.isArray(moviesData) ? moviesData.map(movie => ({
        id: movie._id,
        id_tmdb: movie.id_tmdb,
        title: movie.title,
        original_title: movie.original_title,
        director: movie.director || "Réalisateur inconnu",
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : "Inconnu",
        poster: movie.poster_path || "https://via.placeholder.com/250x370",
        description: movie.overview,
        rating: movie.vote_average / 2,
        runtime: movie.runtime,
        genres: movie.genres,
        popularity: movie.popularity,
        comments: movie.comments || []
      })) : [];
      
      // Mise à jour de l'état
      setMovies(formattedMovies);
      
      // Mettre à jour la pagination si disponible
      if (data.pagination) {
        setPagination(data.pagination);
      }
      
      // Extraire tous les genres des films pour le filtre
      if (!genreFilter && !searchTerm) {
        const uniqueGenres = [...new Set(formattedMovies.flatMap(movie => movie.genres || []))];
        setAllGenres(uniqueGenres.sort());
      }
    } catch (err) {
      setError("Erreur lors du chargement des films: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, genreFilter]);
  
  // Charger les films au premier rendu et quand les filtres ou la page changent
  useEffect(() => {
    loadMovies();
  }, [loadMovies]);
  
  // Gérer les changements de page
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };
  
  // Gérer la recherche
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); // Réinitialiser à la première page lors d'une nouvelle recherche
    loadMovies();
  };
  
  // Gérer le changement de filtre genre
  const handleGenreChange = (e) => {
    setGenreFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 })); // Réinitialiser à la première page lors d'un changement de filtre
  };
  
  return (
    <div className="movies-page">
      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un film ou un réalisateur..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            Rechercher
          </button>
        </form>
        
        <div className="filter-section">
          <label className="filter-label">Filtrer par genre:</label>
          <select
            className="genre-filter"
            value={genreFilter}
            onChange={handleGenreChange}
          >
            <option value="">Tous les genres</option>
            {allGenres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>
      
      <h2 className="section-title">Films populaires</h2>
      
      {loading ? (
        <div className="loading">Chargement des films...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="movies-grid">
            {movies.length > 0 ? (
              movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            ) : (
              <div className="no-results">
                <p>Aucun film ne correspond à votre recherche.</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-button" 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft size={20} />
                Précédent
              </button>
              
              <div className="pagination-info">
                Page {pagination.page} sur {pagination.pages}
              </div>
              
              <button 
                className="pagination-button" 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Suivant
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MoviesPage;
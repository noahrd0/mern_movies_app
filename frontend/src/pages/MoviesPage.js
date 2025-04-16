import React, { useState } from 'react';
import { Search } from 'lucide-react';
import MovieCard from '../components/movies/MovieCard';

function MoviesPage({ movies }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  
  // Extraire tous les genres uniques des films
  const allGenres = [...new Set(movies.flatMap(movie => movie.genres || []))];
  
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = 
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (movie.director && movie.director.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGenre = genreFilter === '' || 
      (movie.genres && movie.genres.includes(genreFilter));
    
    return matchesSearch && matchesGenre;
  });
  
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-section">
          <label className="filter-label">Filtrer par genre:</label>
          <select 
            className="genre-filter" 
            value={genreFilter} 
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="">Tous les genres</option>
            {allGenres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>
      
      <h2 className="section-title">Films populaires</h2>
      
      <div className="movies-grid">
        {filteredMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      
      {filteredMovies.length === 0 && (
        <div className="no-results">
          <p>Aucun film ne correspond à votre recherche.</p>
        </div>
      )}
    </div>
  );
}

export default MoviesPage;

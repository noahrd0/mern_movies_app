import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import SearchCard from '../components/common/SearchCard';
import { MovieService, ActorService } from '../services/api';

function HomePage({ allGenres }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [movies, setMovies] = useState([]);
  const [actors, setActors] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [foundActors, setFoundActors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentActorPage, setCurrentActorPage] = useState(1);
  const [totalActorPages, setTotalActorPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // 🔁 Initial load: populaires
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        const [movieResult, actorResult] = await Promise.all([
          MovieService.getAll(currentPage),
          ActorService.getAll(currentActorPage)
        ]);

        setMovies(movieResult?.movies || []);
        setTotalPages(movieResult?.pages || 1);

        setActors(actorResult?.actors || []);
        setTotalActorPages(actorResult?.pages || 1);
      } catch (err) {
        console.error("Erreur lors du chargement des populaires :", err);
        setMovies([]);
        setActors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, [currentPage, currentActorPage]);

  // 🔁 Recherche / filtres
  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!searchTerm && !genreFilter) return;

        setLoading(true);
        const movieResult = await MovieService.filter(searchTerm, genreFilter, currentPage);

        setFilteredMovies(movieResult?.movies || []);
        setTotalPages(movieResult?.pages || 1);

        if (searchTerm.trim()) {
          const actorResult = await ActorService.search(searchTerm);
          setFoundActors(actorResult || []);
        } else {
          setFoundActors([]);
        }
      } catch (err) {
        console.error("Erreur lors de la recherche :", err);
        setFilteredMovies([]);
        setFoundActors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm, genreFilter, currentPage]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);
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

  const renderActorPagination = () => {
    if (totalActorPages <= 1) return null;
    const pages = Array.from({ length: Math.min(totalActorPages, 5) }, (_, i) => i + 1);
    return (
      <div className="pagination">
        {pages.map((page) => (
          <button
            key={page}
            className={`page-btn ${currentActorPage === page ? 'active' : ''}`}
            onClick={() => setCurrentActorPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="movies-page">
      {/* Barre de recherche */}
      <div className="search-filters">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un film ou un acteur..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
              setCurrentActorPage(1);
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
              setCurrentPage(1);
            }}
          >
            <option value="">Tous les genres</option>
            {allGenres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Résultats ou accueil */}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          {(searchTerm || genreFilter) ? (
            <>
              {filteredMovies.length > 0 && (
                <>
                  <h3>🎬 Films trouvés</h3>
                  <div className="movies-grid">
                    {filteredMovies.map((movie) => (
                      <SearchCard key={movie.id} type="movie" data={movie} />
                    ))}
                  </div>
                  {renderPagination()}
                </>
              )}

              {foundActors.length > 0 && (
                <>
                  <h3>👤 Acteurs trouvés</h3>
                  <div className="movies-grid">
                    {foundActors.map((actor) => (
                      <SearchCard key={actor._id} type="actor" data={actor} />
                    ))}
                  </div>
                </>
              )}

              {filteredMovies.length === 0 && foundActors.length === 0 && (
                <p className="no-results">Aucun résultat.</p>
              )}
            </>
          ) : (
            <>
              <h2 className="section-title">🎬 Films populaires</h2>
              <div className="movies-grid">
                {Array.isArray(movies) && movies.map((movie) => (
                  <SearchCard key={movie.id} type="movie" data={movie} />
                ))}
              </div>
              {renderPagination()}

              <h2 className="section-title">👤 Acteurs populaires</h2>
              <div className="movies-grid">
                {Array.isArray(actors) && actors.map((actor) => (
                  <SearchCard key={actor._id} type="actor" data={actor} />
                ))}
              </div>
              {renderActorPagination()}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from '../common/RatingStars';

function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="movie-card">
      <img 
        src={movie.poster} 
        alt={`Affiche de ${movie.title}`}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-meta">
          {movie.year}
          {movie.director && movie.director !== "Réalisateur inconnu" && `, ${movie.director}`}
        </p>
        {movie.genres && movie.genres.length > 0 && (
          <div className="movie-genres">
            {movie.genres.slice(0, 2).map(genre => (
              <span key={genre} className="genre-tag">{genre}</span>
            ))}
          </div>
        )}
        <div className="movie-rating">
          <RatingStars rating={movie.rating} />
          <span className="rating-text">{movie.rating.toFixed(1)}/5</span>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
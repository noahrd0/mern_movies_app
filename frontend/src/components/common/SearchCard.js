import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';

function SearchCard({ type, data }) {
  if (type === 'movie') {
    return (
      <Link to={`/movies/${data.id}`} className="movie-card">
        <img
          src={data.poster || 'https://placehold.co/250x370?text=Aucune+image'}
          alt={`Affiche de ${data.title}`}
          className="movie-poster"
        />
        <div className="movie-info">
          <h3 className="movie-title">{data.title}</h3>
          <p className="movie-meta">
            {data.year}
            {data.director && data.director !== "Réalisateur inconnu" && `, ${data.director}`}
          </p>
          {data.genres?.length > 0 && (
            <div className="movie-genres">
              {data.genres.slice(0, 2).map(genre => (
                <span key={genre} className="genre-tag">{genre}</span>
              ))}
            </div>
          )}
          <div className="movie-rating">
            <RatingStars rating={data.rating} />
            <span className="rating-text">{data.rating?.toFixed(1)}/5</span>
          </div>
        </div>
      </Link>
    );
  }

  if (type === 'actor') {
    return (
      <Link to={`/actors/${data.id}`} className="movie-card">
        <img
          src={data.profile_path || 'https://placehold.co/250x370?text=Aucune+image'}
          alt={`Portrait de ${data.name}`}
          className="movie-poster"
        />
        <div className="movie-info">
          <h3 className="movie-title">{data.name}</h3>
          <p className="movie-meta">{data.movies?.length || 0} films</p>
        </div>
      </Link>
    );
  }

  return null;
}

export default SearchCard;

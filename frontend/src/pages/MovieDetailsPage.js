// src/pages/MovieDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import RatingStars from '../components/common/RatingStars';
import CommentSection from '../components/movies/CommentSection';

function MovieDetailsPage({ onAddToWishlist, isLoggedIn, wishlist }) {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/movies/${id}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des détails du film');
        }
        
        const movieData = await response.json();
        
        // Formatter les données
        const formattedMovie = {
          id: movieData._id,
          id_tmdb: movieData.id_tmdb,
          title: movieData.title,
          original_title: movieData.original_title,
          director: movieData.director || "Réalisateur inconnu",
          year: new Date(movieData.release_date).getFullYear(),
          poster: movieData.poster_path || "https://via.placeholder.com/250x370",
          description: movieData.overview,
          rating: movieData.vote_average / 2, // Convertir la note sur 10 à une note sur 5
          runtime: movieData.runtime,
          genres: movieData.genres,
          popularity: movieData.popularity,
          comments: movieData.comments || [],
          cast: movieData.cast || [] // Ajout du casting
        };
        
        setMovie(formattedMovie);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails du film:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Gestion des commentaires
  const submitComment = async (movieId, commentText, rating) => {
    if (!isLoggedIn) {
      // Gérer la redirection pour se connecter
      return;
    }
    
    try {
      // Envoi du commentaire à l'API
      const response = await fetch(`http://localhost:5000/api/movies/${movieId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          text: commentText,
          rating: rating
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du commentaire');
      }
      
      // Recharger les données du film pour avoir les informations à jour
      const updatedResponse = await fetch(`http://localhost:5000/api/movies/${id}`);
      const updatedMovieData = await updatedResponse.json();
      
      // Mettre à jour l'état du film
      const updatedMovie = {
        ...movie,
        comments: updatedMovieData.comments || [],
        rating: updatedMovieData.vote_average / 2
      };
      
      setMovie(updatedMovie);
      
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      alert("Une erreur est survenue lors de l'ajout de votre commentaire.");
    }
  };

  // Formatage de la durée du film
  const formatRuntime = (minutes) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  };
  
  if (isLoading) return <div className="loading">Chargement des détails du film...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;
  if (!movie) return <div className="not-found">Film non trouvé</div>;
  
  const isInWishlist = wishlist.some(m => m.id === movie.id);
  
  return (
    <div className="movie-details">
      <button 
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        Retour aux films
      </button>
      
      <div className="details-content">
        <div className="movie-poster-section">
          <img 
            src={movie.poster} 
            alt={`Affiche de ${movie.title}`}
            className="detail-poster"
          />
          <button 
            className={`wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}`}
            onClick={() => !isInWishlist && onAddToWishlist(movie)}
            disabled={isInWishlist}
          >
            <Heart size={18} fill={isInWishlist ? "#4B5563" : "#ffffff"} />
            {isInWishlist ? 'Dans votre wishlist' : 'Ajouter à ma wishlist'}
          </button>
        </div>
        
        <div className="movie-info-section">
          <h2 className="detail-title">{movie.title}</h2>
          {movie.original_title !== movie.title && (
            <p className="original-title">Titre original: {movie.original_title}</p>
          )}
          
          <div className="movie-metadata">
            <p className="detail-meta">
              {movie.year}
              {movie.runtime && ` • ${formatRuntime(movie.runtime)}`}
            </p>
            
            {movie.genres && movie.genres.length > 0 && (
              <div className="genres-list">
                {movie.genres.map(genre => (
                  <span key={genre} className="genre-tag">{genre}</span>
                ))}
              </div>
            )}
          </div>
          
          <div className="detail-rating">
            <RatingStars rating={movie.rating} size={24} />
            <span className="rating-value">{movie.rating.toFixed(1)}/5</span>
          </div>
          
          <div className="synopsis">
            <h3 className="section-subheading">Synopsis</h3>
            <p>{movie.description}</p>
          </div>
          
          {/* Nouvelle section pour le casting */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="cast-section">
              <h3 className="section-subheading">Casting</h3>
              <div className="cast-list">
                {movie.cast.map(actor => (
                  <div key={actor.id} className="cast-member">
                    <div className="actor-image-container">
                      <img 
                        src={actor.profile_path || "https://via.placeholder.com/150x225"} 
                        alt={`${actor.name}`}
                        className="actor-image"
                      />
                    </div>
                    <div className="actor-info">
                      <p className="actor-name">{actor.name}</p>
                      {actor.character && (
                        <p className="actor-character">{actor.character}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <CommentSection 
            comments={movie.comments} 
            onSubmitComment={submitComment} 
            isLoggedIn={isLoggedIn} 
            movieId={movie.id}
          />
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsPage;
// App.js
import React, { useState, useEffect } from 'react';
import { XCircle, Star, StarHalf, Heart, LogIn, UserPlus, Search, Film, ListChecks } from 'lucide-react';
import './App.css'; // Assurez-vous de créer ce fichier CSS

// Composant principal App
function App() {
  const [activePage, setActivePage] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Effet pour charger les films au démarrage
  useEffect(() => {
    // Données d'exemple pour les films
    const sampleMovies = [
      {
        id: 1,
        title: "Inception",
        director: "Christopher Nolan",
        year: 2010,
        poster: "https://via.placeholder.com/250x370",
        description: "Un voleur qui s'infiltre dans les rêves des autres pour voler leurs secrets.",
        rating: 4.8,
        comments: [
          { id: 1, user: "Alice", text: "Un chef-d'œuvre absolu !", rating: 5 },
          { id: 2, user: "Bob", text: "Difficile à suivre mais captivant.", rating: 4 }
        ]
      },
      {
        id: 2,
        title: "Pulp Fiction",
        director: "Quentin Tarantino",
        year: 1994,
        poster: "https://via.placeholder.com/250x370",
        description: "Les destins de plusieurs criminels s'entrecroisent de façon non-linéaire.",
        rating: 4.7,
        comments: [
          { id: 1, user: "Charles", text: "Le meilleur film de Tarantino !", rating: 5 },
          { id: 2, user: "David", text: "Les dialogues sont géniaux.", rating: 5 }
        ]
      },
      {
        id: 3,
        title: "Le Parrain",
        director: "Francis Ford Coppola",
        year: 1972,
        poster: "https://via.placeholder.com/250x370",
        description: "L'histoire de la famille Corleone, une des grandes familles de la mafia italo-américaine.",
        rating: 4.9,
        comments: [
          { id: 1, user: "Emma", text: "Un classique intemporel.", rating: 5 },
          { id: 2, user: "Frank", text: "Marlon Brando est inoubliable.", rating: 5 }
        ]
      },
      {
        id: 4,
        title: "Interstellar",
        director: "Christopher Nolan",
        year: 2014,
        poster: "https://via.placeholder.com/250x370",
        description: "Des explorateurs voyagent à travers un trou de ver pour sauver l'humanité.",
        rating: 4.6,
        comments: [
          { id: 1, user: "Grace", text: "La musique et les effets visuels sont incroyables.", rating: 5 },
          { id: 2, user: "Henry", text: "Une histoire touchante avec de la science.", rating: 4 }
        ]
      }
    ];
    
    setMovies(sampleMovies);
  }, []);

  // Fonction pour ajouter un film à la wishlist
  const addToWishlist = (movie) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    if (!wishlist.some(m => m.id === movie.id)) {
      setWishlist([...wishlist, movie]);
    }
  };

  // Fonction pour retirer un film de la wishlist
  const removeFromWishlist = (movieId) => {
    setWishlist(wishlist.filter(movie => movie.id !== movieId));
  };

  // Fonction pour soumettre un nouveau commentaire
  const submitComment = (movieId, commentText, rating) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    const updatedMovies = movies.map(movie => {
      if (movie.id === movieId) {
        const newComment = {
          id: movie.comments.length + 1,
          user: username,
          text: commentText,
          rating: rating
        };
        
        // Calculer la nouvelle note moyenne
        const totalRatings = [...movie.comments, newComment].reduce((sum, comment) => sum + comment.rating, 0);
        const newRating = totalRatings / (movie.comments.length + 1);
        
        return {
          ...movie,
          comments: [...movie.comments, newComment],
          rating: parseFloat(newRating.toFixed(1))
        };
      }
      return movie;
    });
    
    setMovies(updatedMovies);
    
    // Si on affiche actuellement le film, mettre à jour le film sélectionné
    if (selectedMovie && selectedMovie.id === movieId) {
      setSelectedMovie(updatedMovies.find(movie => movie.id === movieId));
    }
  };

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Connexion réussie
        setIsLoggedIn(true);
        setUsername(data.user.name);
        setShowLoginModal(false);
  
        // Stocker le token JWT dans le stockage local
        localStorage.setItem('token', data.token);
  
        console.log('Connexion réussie :', data);
      } else {
        // Gérer les erreurs (ex. : mauvais identifiants)
        console.error('Erreur de connexion :', data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  // Fonction d'inscription
  const register = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setIsLoggedIn(true);
        setUsername(data.user.name);
        setShowRegisterModal(false);
  
        localStorage.setItem('token', data.token);
  
        console.log('Inscription réussie :', data);
      } else {
        console.error('Erreur d\'inscription :', data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('token');
  };

  // Rendu des pages en fonction de la page active
  const renderContent = () => {
    switch (activePage) {
      case 'movies':
        return <MoviesPage 
                 movies={movies} 
                 onMovieClick={(movie) => {
                   setSelectedMovie(movie);
                   setActivePage('movieDetails');
                 }} 
               />;
      case 'movieDetails':
        return selectedMovie ? 
               <MovieDetailsPage 
                 movie={selectedMovie} 
                 onBack={() => setActivePage('movies')} 
                 onAddToWishlist={addToWishlist}
                 isInWishlist={wishlist.some(m => m.id === selectedMovie.id)}
                 onSubmitComment={submitComment}
                 isLoggedIn={isLoggedIn}
               /> : 
               <div>Film non trouvé</div>;
      case 'wishlist':
        return <WishlistPage 
                 wishlist={wishlist} 
                 onRemoveFromWishlist={removeFromWishlist}
                 onMovieClick={(movie) => {
                   setSelectedMovie(movie);
                   setActivePage('movieDetails');
                 }}
               />;
      default:
        return <MoviesPage 
                 movies={movies} 
                 onMovieClick={(movie) => {
                   setSelectedMovie(movie);
                   setActivePage('movieDetails');
                 }} 
               />;
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <h1 className="app-title" onClick={() => setActivePage('movies')}>
            CinéFriends
          </h1>
          <div className="header-controls">
            {isLoggedIn ? (
              <div className="user-info">
                <span>Bonjour, {username}</span>
                <button 
                  className="btn btn-logout"
                  onClick={logout}
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button 
                  className="btn btn-login"
                  onClick={() => setShowLoginModal(true)}
                >
                  <LogIn size={16} />
                  Connexion
                </button>
                <button 
                  className="btn btn-register"
                  onClick={() => setShowRegisterModal(true)}
                >
                  <UserPlus size={16} />
                  Inscription
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        <div className="container">
          <button 
            className={`nav-btn ${activePage === 'movies' ? 'active' : ''}`}
            onClick={() => setActivePage('movies')}
          >
            <Film size={16} />
            Films
          </button>
          <button 
            className={`nav-btn ${activePage === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActivePage('wishlist')}
          >
            <ListChecks size={16} />
            Ma Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="app-main container">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; 2025 CinéFriends - Tous droits réservés</p>
      </footer>

      {/* Modales */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onLogin={login} 
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}
      
      {showRegisterModal && (
        <RegisterModal 
          onClose={() => setShowRegisterModal(false)} 
          onRegister={register}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </div>
  );
}

// Composant pour la page des films
function MoviesPage({ movies, onMovieClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.director.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="movies-page">
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
      
      <h2 className="section-title">Films populaires</h2>
      
      <div className="movies-grid">
        {filteredMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick(movie)} />
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

// Composant pour la carte d'un film
function MovieCard({ movie, onClick }) {
  return (
    <div className="movie-card" onClick={onClick}>
      <img 
        src={movie.poster} 
        alt={`Affiche de ${movie.title}`}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-meta">{movie.director}, {movie.year}</p>
        <div className="movie-rating">
          <RatingStars rating={movie.rating} />
          <span className="rating-text">{movie.rating}/5</span>
        </div>
      </div>
    </div>
  );
}

// Composant pour les détails d'un film
function MovieDetailsPage({ movie, onBack, onAddToWishlist, isInWishlist, onSubmitComment, isLoggedIn }) {
  const [commentText, setCommentText] = useState('');
  const [ratingValue, setRatingValue] = useState(5);
  
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onSubmitComment(movie.id, commentText, ratingValue);
      setCommentText('');
      setRatingValue(5);
    }
  };
  
  return (
    <div className="movie-details">
      <button 
        className="back-btn"
        onClick={onBack}
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
          <p className="detail-meta">{movie.director}, {movie.year}</p>
          
          <div className="detail-rating">
            <RatingStars rating={movie.rating} size={24} />
            <span className="rating-value">{movie.rating}/5</span>
          </div>
          
          <div className="synopsis">
            <h3 className="section-subheading">Synopsis</h3>
            <p>{movie.description}</p>
          </div>
          
          <div className="comments-section">
            <h3 className="section-subheading">Commentaires ({movie.comments.length})</h3>
            
            {movie.comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-user">{comment.user}</span>
                  <div className="comment-rating">
                    <RatingStars rating={comment.rating} size={16} />
                    <span>{comment.rating}/5</span>
                  </div>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))}
            
            <form onSubmit={handleSubmitComment} className="comment-form">
              <h4 className="form-title">Ajouter un commentaire</h4>
              
              {!isLoggedIn && (
                <p className="login-required">
                  Vous devez être connecté pour laisser un commentaire.
                </p>
              )}
              
              <div className="rating-input">
                <label>Note :</label>
                <div className="stars-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className="star-btn"
                      onClick={() => setRatingValue(star)}
                    >
                      <Star size={24} fill={star <= ratingValue ? "#FBBF24" : "none"} color="#FBBF24" />
                    </button>
                  ))}
                </div>
              </div>
              
              <textarea
                placeholder="Partagez votre avis sur ce film..."
                className="comment-textarea"
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={!isLoggedIn}
              />
              
              <button
                type="submit"
                className="submit-btn"
                disabled={!isLoggedIn || !commentText.trim()}
              >
                Publier
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour la page de wishlist
function WishlistPage({ wishlist, onRemoveFromWishlist, onMovieClick }) {
  return (
    <div className="wishlist-page">
      <h2 className="section-title">Ma Wishlist</h2>
      
      {wishlist.length > 0 ? (
        <div className="wishlist-items">
          {wishlist.map(movie => (
            <div key={movie.id} className="wishlist-item">
              <img 
                src={movie.poster} 
                alt={`Affiche de ${movie.title}`}
                className="wishlist-poster"
                onClick={() => onMovieClick(movie)}
              />
              <div className="wishlist-info" onClick={() => onMovieClick(movie)}>
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-meta">{movie.director}, {movie.year}</p>
                <div className="movie-rating">
                  <RatingStars rating={movie.rating} />
                  <span className="rating-text">{movie.rating}/5</span>
                </div>
              </div>
              <button 
                className="remove-btn"
                onClick={() => onRemoveFromWishlist(movie.id)}
              >
                <XCircle size={24} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-wishlist">
          <p>Votre wishlist est vide.</p>
          <button 
            className="discover-btn"
            onClick={() => window.location.hash = 'movies'}
          >
            Découvrir des films
          </button>
        </div>
      )}
    </div>
  );
}

// Composant pour la notation en étoiles
function RatingStars({ rating, size = 20 }) {
  // Convertir la note en nombre d'étoiles pleines et demi-étoiles
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="rating-stars">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < fullStars) {
          return <Star key={i} size={size} fill="#FBBF24" color="#FBBF24" />;
        } else if (i === fullStars && hasHalfStar) {
          return <StarHalf key={i} size={size} fill="#FBBF24" color="#FBBF24" />;
        } else {
          return <Star key={i} size={size} color="#FBBF24" />;
        }
      })}
    </div>
  );
}

// Composant pour la modale de connexion
function LoginModal({ onClose, onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Connexion</h2>
          <button onClick={onClose} className="close-btn">
            <XCircle size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="submit-btn full-width"
            disabled={!email || !password}
          >
            Se connecter
          </button>
          
          <p className="form-footer">
            Pas encore inscrit ?{' '}
            <button
              type="button"
              className="text-link"
              onClick={onSwitchToRegister}
            >
              Créer un compte
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

// Composant pour la modale d'inscription
function RegisterModal({ onClose, onRegister, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && email && password && password === confirmPassword) {
      onRegister(username, email, password);
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Inscription</h2>
          <button onClick={onClose} className="close-btn">
            <XCircle size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-username">Nom d'utilisateur</label>
            <input
              type="text"
              id="register-username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="register-password">Mot de passe</label>
            <input
              type="password"
              id="register-password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirm-password">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirm-password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {password && confirmPassword && password !== confirmPassword && (
              <p className="error-text">Les mots de passe ne correspondent pas.</p>
            )}
          </div>
          
          <button
            type="submit"
            className="submit-btn full-width register-btn"
            disabled={!username || !email || !password || password !== confirmPassword}
          >
            S'inscrire
          </button>
          
          <p className="form-footer">
            Déjà inscrit ?{' '}
            <button
              type="button"
              className="text-link"
              onClick={onSwitchToLogin}
            >
              Se connecter
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default App;
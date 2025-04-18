// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import MoviesPage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import WishlistPage from './pages/WishlistPage';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effet pour charger les films au démarrage depuis l'API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);

        // Appel vers l'endpoint (tu peux ajouter `?page=1` si besoin)
        const response = await fetch('http://localhost:5000/api/movies?page=1');

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des films');
        }

        const data = await response.json();
        const moviesData = data.movies; // <- accès correct à la clé

        // Transformation au format attendu
        const formattedMovies = moviesData.map(movie => ({
          id: movie._id,
          id_tmdb: movie.id_tmdb,
          title: movie.title,
          original_title: movie.original_title,
          director: movie.director || "Réalisateur inconnu",
          year: new Date(movie.release_date).getFullYear(),
          poster: movie.poster_path || "https://via.placeholder.com/250x370",
          description: movie.overview,
          rating: movie.vote_average / 2,
          runtime: movie.runtime,
          genres: movie.genres,
          popularity: movie.popularity,
          comments: movie.comments || []
        }));

        setMovies(formattedMovies);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des films:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchMovies();

    // Vérifier si l'utilisateur est connecté au chargement
    const token = localStorage.getItem('token');
    if (token) {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setIsLoggedIn(true);
        setUsername(storedUsername);

        const savedWishlist = localStorage.getItem(`wishlist_${storedUsername}`);
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
      }
    }
  }, []);


  // Fonction pour ajouter un film à la wishlist
  const addToWishlist = (movie) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (!wishlist.some(m => m.id === movie.id)) {
      const updatedWishlist = [...wishlist, movie];
      setWishlist(updatedWishlist);

      // Sauvegarde locale de la wishlist pour l'utilisateur connecté
      if (isLoggedIn) {
        localStorage.setItem(`wishlist_${username}`, JSON.stringify(updatedWishlist));
      }
    }
  };

  // Fonction pour retirer un film de la wishlist
  const removeFromWishlist = (movieId) => {
    const updatedWishlist = wishlist.filter(movie => movie.id !== movieId);
    setWishlist(updatedWishlist);

    // Mise à jour de la sauvegarde locale
    if (isLoggedIn) {
      localStorage.setItem(`wishlist_${username}`, JSON.stringify(updatedWishlist));
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

        // Stocker le token JWT et le nom d'utilisateur dans le stockage local
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.name);

        // Charger la wishlist de l'utilisateur
        const savedWishlist = localStorage.getItem(`wishlist_${data.user.name}`);
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }

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
        localStorage.setItem('username', data.user.name);

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
    localStorage.removeItem('username');
    // On garde la wishlist en mémoire locale pour quand l'utilisateur se reconnectera
  };

  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <Header
          isLoggedIn={isLoggedIn}
          username={username}
          onLogout={logout}
          onShowLogin={() => setShowLoginModal(true)}
          onShowRegister={() => setShowRegisterModal(true)}
        />

        {/* Navigation */}
        <Navigation wishlistCount={wishlist.length} />

        {/* Main Content */}
        <main className="app-main container">
          {isLoading ? (
            <div className="loading">Chargement des films...</div>
          ) : error ? (
            <div className="error">Erreur: {error}</div>
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <MoviesPage
                    allGenres={[...new Set(movies.flatMap(movie => movie.genres || []))]}
                  />
                }
              />
              <Route
                path="/movies/:id"
                element={
                  <MovieDetailsPage
                    onAddToWishlist={addToWishlist}
                    isLoggedIn={isLoggedIn}
                    wishlist={wishlist}
                  />
                }
              />
              <Route
                path="/wishlist"
                element={
                  <WishlistPage
                    wishlist={wishlist}
                    onRemoveFromWishlist={removeFromWishlist}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

          )}
        </main>

        {/* Footer */}
        <Footer />

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
    </Router>
  );
}

export default App;
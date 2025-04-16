// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import MoviesPage from './pages/MoviesPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import WishlistPage from './pages/WishlistPage';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import './App.css';

function App() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const storedUsername = localStorage.getItem('username');
        setIsLoggedIn(true);
        setUsername(storedUsername);
        
        // Charger la wishlist de l'utilisateur
        const savedWishlist = localStorage.getItem(`wishlist_${storedUsername}`);
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
      }
    };

    checkLoginStatus();
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
      setIsLoading(true);
      const response = await fetch('http://localhost:5001/api/user/login', {
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
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (username, email, password) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5001/api/user/register', {
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
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
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
          <Routes>
            <Route 
              path="/" 
              element={<MoviesPage />} 
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
            isLoading={isLoading}
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
            isLoading={isLoading}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ isLoggedIn, username, onLogout }) {
  const navigate = useNavigate();
  return (
    <header className="app-header">
      <div className="container">
      <h1 className="app-title" onClick={() => navigate("/")}>
          🎬 CinéFriends
        </h1>
        <div className="header-controls">
          {isLoggedIn ? (
            <div className="user-info">
              <span>Bienvenue, {username}</span>
              <button 
                className="btn btn-logout"
                onClick={onLogout}
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className="btn btn-login"
                onClick={() => navigate("/auth")}
              >
                Connexion / Inscription
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

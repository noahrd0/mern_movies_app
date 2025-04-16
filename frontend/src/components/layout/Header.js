import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

function Header({ isLoggedIn, username, onLogout, onShowLogin, onShowRegister }) {
  return (
    <header className="app-header">
      <div className="container">
        <h1 className="app-title">
          <Link to="/">CinéFriends</Link>
        </h1>
        <div className="header-controls">
          {isLoggedIn ? (
            <div className="user-info">
              <span>Bonjour, {username}</span>
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
                onClick={onShowLogin}
              >
                <LogIn size={16} />
                Connexion
              </button>
              <button 
                className="btn btn-register"
                onClick={onShowRegister}
              >
                <UserPlus size={16} />
                Inscription
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

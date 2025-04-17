import React, { useState } from 'react';
import { XCircle } from 'lucide-react';

function LoginModal({ onClose, onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <XCircle size={24} />
        </button>
        
        <h2 className="modal-header">Connexion</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="submit-btn full-width">
            Se connecter
          </button>
        </form>
        
        <p className="auth-switch form-footer">
          Pas encore de compte ? 
          <button className="text-btn" onClick={onSwitchToRegister}>
            S'inscrire
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
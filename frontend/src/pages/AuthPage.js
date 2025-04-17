import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/auth/LoginModal";
import RegisterModal from "../components/auth/RegisterModal";
import "./AuthPage.css";

export default function AuthPage({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true); // toggle entre login/register
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    await onLogin(email, password);
    navigate("/");
  };

  const handleRegister = async (username, email, password) => {
    await onRegister(username, email, password);
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-toggle">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
        >
          Connexion
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
        >
          Inscription
        </button>
      </div>

      {isLogin ? (
        <LoginModal
          onClose={() => navigate("/")}
          onLogin={handleLogin}
          onSwitchToRegister={() => setIsLogin(false)}
        />
      ) : (
        <RegisterModal
          onClose={() => navigate("/")}
          onRegister={handleRegister}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
}

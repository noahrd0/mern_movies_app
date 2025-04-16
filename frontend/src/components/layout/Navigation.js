// src/components/layout/Navigation.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Film, ListChecks } from 'lucide-react';

function Navigation({ wishlistCount }) {
  return (
    <nav className="app-nav">
      <div className="container">
        <NavLink 
          to="/"
          className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
        >
          <Film size={16} />
          Films
        </NavLink>
        <NavLink 
          to="/wishlist"
          className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
        >
          <ListChecks size={16} />
          Ma Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
        </NavLink>
      </div>
    </nav>
  );
}

export default Navigation;
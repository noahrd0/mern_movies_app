import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import SearchCard from '../components/common/SearchCard';

function WishlistPage({ wishlist, onRemoveFromWishlist }) {
  return (
    <div className="wishlist-page">
      <h2 className="section-title">Ma Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <p>Votre wishlist est vide.</p>
          <Link to="/" className="btn-primary">Découvrir des films</Link>
        </div>
      ) : (
        <div className="wishlist-movies">
          {wishlist.map(movie => (
            <div key={movie.id} className="wishlist-item-wrapper">
              <SearchCard type="movie" data={movie} />
              <button 
                className="remove-btn" 
                onClick={() => onRemoveFromWishlist(movie.id)}
                title="Retirer de ma wishlist"
              >
                <XCircle size={24} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;

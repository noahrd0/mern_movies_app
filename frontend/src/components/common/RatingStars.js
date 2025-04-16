import React from 'react';
import { Star, StarHalf } from 'lucide-react';

function RatingStars({ rating, size = 20 }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="rating-stars">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} fill="#FBBF24" color="#FBBF24" />
      ))}
      
      {hasHalfStar && (
        <StarHalf size={size} fill="#FBBF24" color="#FBBF24" />
      )}
      
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} color="#FBBF24" />
      ))}
    </div>
  );
}

export default RatingStars;
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import RatingStars from '../common/RatingStars';

function CommentSection({ comments, onSubmitComment, isLoggedIn, movieId }) {
  const [commentText, setCommentText] = useState('');
  const [ratingValue, setRatingValue] = useState(5);

  const calculateAverageRating = () => {
    if (!comments || comments.length === 0) return 0;
    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    return (totalRating / comments.length).toFixed(1);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onSubmitComment(movieId, commentText, ratingValue);
      setCommentText('');
      setRatingValue(5);
    }
  };

  return (
    <div className="comments-section">
      <h3 className="section-subheading">
        Commentaires {comments && `(${comments.length}) `} 
        {comments && comments.length > 0 && (
          <span className="average-rating">
            - Note CinéFriends : {calculateAverageRating()}/5
          </span>
        )}
      </h3>
      {comments && comments.length > 0 ? (
        comments.map(comment => (
          <div id={comment.userId} key={comment.id} className="comment">
            <div className="comment-header">
              <span className="comment-user">{comment.userName}</span>
              <div className="comment-rating">
                <RatingStars rating={comment.rating} size={16} />
                <span>{comment.rating}/5</span>
              </div>
            </div>
            <p className="comment-text">{comment.content}</p>
          </div>
        ))
      ) : (
        <p className="no-comments">Aucun commentaire pour ce film.</p>
      )}
      
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
                disabled={!isLoggedIn}
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
  );
}

export default CommentSection;
import React from "react";
import "./Review.css";
import { HiBadgeCheck } from "react-icons/hi";

function Review({ reviews }) {
  const getRelativeTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return ""; 
      
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "today";
      if (diffDays === 1) return "yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch (e) {
      return "";
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <>
        {'★'.repeat(fullStars)}
        {halfStar ? '½' : ''}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  const firstReview = reviews && reviews.length > 0 ? reviews[0] : null;

  return (
    <div>
      <p className="review-title">Customer Reviews ({reviews ? reviews.length : 0})</p>

      {firstReview ? (
        <>
          <div className="review-container">
            <div className="review-content">              
              <div className="review-image ">
                {firstReview.userId?.name?.charAt(0) || "?"}
              </div>
              <div className="review-details">
                <p className="review-name">{firstReview.userId?.name || "Anonymous"}</p>
                <div className="review-rating">
                  <span className="review-score">{firstReview.rating?.toFixed(1) || "0.0"}</span>
                  <div className="review-stars">
                    {renderStars(firstReview.rating || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="review-text">{firstReview.message || "No review message"}</p>
          <p className="purchased">
            <HiBadgeCheck className="badge-check" />
            Purchased
            <span className="dot"> • </span> {getRelativeTime(firstReview.createdAt)}
          </p>
        </>
      ) : (
        <p>No reviews yet.</p>
      )}

      {reviews && reviews.length > 1 && (
        <button className="allreviewbutton">
          <span className="allreviewbutton-text">View all Reviews</span>
        </button>
      )}
    </div>
  );
}

export default Review;
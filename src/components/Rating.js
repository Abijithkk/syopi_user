import React from 'react';
import './Rating.css';

function Rating({ reviews }) {

  const defaultRatings = {
    averageRating: 0,
    totalRatings: 0,
    starDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  };

  // Calculate ratings from reviews if available
  const calculateRatings = () => {
    if (!reviews || reviews.length === 0) {
      return defaultRatings;
    }

    const starDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    // Count ratings by star level
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        starDistribution[review.rating] += 1;
      }
    });

    const totalRatings = reviews.length;
    
    // Calculate average rating
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRatings > 0 ? (sum / totalRatings).toFixed(1) : 0;

    return {
      averageRating,
      totalRatings,
      starDistribution,
    };
  };

  const ratings = calculateRatings();

  const getProgressBarColor = (rating) => {
    switch (rating) {
      case 5:
        return '#14958F'; 
      case 4:
        return '#14958F'; 
      case 3:
        return '#14958F80'; 
      case 2:
        return '#FBCA01'; 
      case 1:
        return '#F16565'; 
      default:
        return '#E0E0E0'; 
    }
  };
  
  const getProgressBarWidth = (starCount) => {
    return ratings.totalRatings > 0 
      ? (ratings.starDistribution[starCount] / ratings.totalRatings) * 100
      : 0;
  };

  return (
    <div className="rating-container">
      <div className="rating-heading">
        <div className="heading-text">Rating</div>
      </div>

      <div className="rating-body">
        <div className="rating-left-column">
          <div className="flex items-center">
            <div className="average-rating">{ratings.averageRating}</div>
            <div className="rating-stars ml-1">
              {'★'}
            </div>
          </div>
          <div className="verified-buyers">{ratings.totalRatings} Verified Buyers</div>
        </div>

        <div className="rating-right-column">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div className="rating-line" key={rating}>
              <span>
                {rating} 
                <span className="rating-stars">{'★'}</span>
              </span>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${getProgressBarWidth(rating)}%`,
                    backgroundColor: getProgressBarColor(rating),
                  }}
                ></div>
              </div>
              <span className="people-rated">
                {ratings.starDistribution[rating]} 
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Rating;
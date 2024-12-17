import React from 'react';
import './Rating.css';

function Rating() {
  const ratings = {
    averageRating: 4.3,
    totalRatings: 1400,
    starDistribution: {
      5: 800,
      4: 300,
      3: 150,
      2: 100,
      1: 50,
    },
  };
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
    return (ratings.starDistribution[starCount] / ratings.totalRatings) * 100;
  };

  return (
    <div className="rating-container">
      <div className="rating-heading">
        <div className="heading-text">Rating</div>
        
      </div>

      <div className="rating-body">

        <div className="rating-left-column">
  <div style={{display:'flex'}}>
      <div className='average-rating'>{ratings.averageRating}</div>
      <div className="rating-stars">
        {'★'}
      </div>
  </div>
  <div className='verified-buyers'>{ratings.totalRatings} Verified Buyers</div>
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

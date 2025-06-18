import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import './Rating.css';
import { addReviewApi } from '../services/allApi';
import { useParams } from 'react-router-dom';

function Rating({ reviews }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
const { id } = useParams();
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

  const handleStarClick = (rating) => {
    setNewRating(rating);
  };

const handleSubmitReview = async (e) => {
  e.preventDefault();
  
  if (!id) {
    toast.error('Product ID is missing');
    return;
  }
  
  if (newRating === 0) {
    toast.error('Please select a rating');
    return;
  }
  
  if (!reviewMessage.trim()) {
    toast.error('Please write a review message');
    return;
  }

  setIsSubmitting(true);
  
  try {
    const reviewData = {
      productId: id,
      rating: newRating,
      message: reviewMessage.trim()
    };
    
    const response = await addReviewApi(reviewData);
    console.log('API Response:', response);
    
    // Handle successful response
    if (response && response.success) {
      toast.success('Review submitted successfully!');
      setNewRating(0);
      setReviewMessage('');
      setShowReviewForm(false);
      // Optionally refresh reviews list here
      // fetchReviews(); 
    } else {
      // Handle API error responses
      let errorMessage = 'Failed to submit review';
      
      if (response && response.error) {
        // If error is an object, extract the message
        if (typeof response.error === 'object' && response.error.message) {
          errorMessage = response.error.message;
        } else if (typeof response.error === 'string') {
          errorMessage = response.error;
        }
      }
      
      // Handle specific status codes
      if (response && response.status === 401) {
        errorMessage = 'Please login to submit a review';
      } else if (response && response.status === 403) {
        errorMessage = 'You can only review products you have purchased and received';
      }
      
      toast.error(errorMessage);
    }
  } catch (error) {
    console.error('Error submitting review:', error);
    
    let errorMessage = 'Error submitting review. Please try again.';
    
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const serverError = error.response.data;
      
      if (serverError && typeof serverError === 'object') {
        if (serverError.message) {
          errorMessage = serverError.message;
        } else if (serverError.error) {
          errorMessage = typeof serverError.error === 'string' 
            ? serverError.error 
            : serverError.error.message || errorMessage;
        }
      } else if (typeof serverError === 'string') {
        errorMessage = serverError;
      }
      
      // Handle specific HTTP status codes
      if (error.response.status === 401) {
        errorMessage = 'Please login to submit a review';
      } else if (error.response.status === 403) {
        errorMessage = 'You can only review products you have purchased and received';
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};


  const renderStars = (rating, interactive = false, size = 'normal') => {
    const starSize = size === 'large' ? '24px' : '16px';
    return (
      <div className={`rating-stars ${interactive ? 'interactive-stars' : ''}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : 'empty'}`}
            onClick={interactive ? () => handleStarClick(star) : undefined}
            style={{ 
              fontSize: starSize,
              cursor: interactive ? 'pointer' : 'default',
              color: star <= rating ? '#FFD700' : '#E0E0E0'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="rating-container">
      <div className="rating-heading">
        <div className="heading-text">Rating</div>
        <button 
          className="add-review-btn"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          {showReviewForm ? 'Cancel' : 'Add Review'}
        </button>
      </div>

      {showReviewForm && (
        <div className="review-form-container">
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="form-group">
              <label>Your Rating:</label>
              {renderStars(newRating, true, 'large')}
            </div>
            <div className="form-group">
              <label>Your Review:</label>
              <textarea
                value={reviewMessage}
                onChange={(e) => setReviewMessage(e.target.value)}
                placeholder="Write your review here..."
                rows={4}
                maxLength={500}
                required
              />
              <small>{reviewMessage.length}/500 characters</small>
            </div>
            <div className="form-actions">
              <button 
                type="submit" 
                disabled={isSubmitting || newRating === 0}
                className="submit-review-btn"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

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
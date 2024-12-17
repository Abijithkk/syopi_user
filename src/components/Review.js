import React from "react";
import "./Review.css";
import r1 from '../images/r1.png'
import { HiBadgeCheck } from "react-icons/hi";
function Review() {
  return (
   <div>
                    <p className='review-title'>Customer Reviews (194)</p>

        <div className="review-container">
    
          <div className="review-content">
            <img
              src={r1}
              alt="Reviewer"
              className="review-image"
            />
            <div className="review-details">
              <p className="review-name">John </p>
              <div className="review-rating">
                <span className="review-score">4.2</span>
                <div className="review-stars">
                  ★★★★☆
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="review-text">I recently bought a top from Myntra, and I love it! The fabric is soft and comfortable, and it fits perfectly. The design is stylish and matches the pictures on the website. The shopping experience was smooth, with prompt delivery. Great value for money—highly recommended!</p>
        <p className="purchased">
        <HiBadgeCheck className="badge-check"></HiBadgeCheck>
        Purchased
            <span className="dot"> • </span> 6 days ago
          </p>
          <button className="allreviewbutton"><span className="allreviewbutton-text">View all Reviews</span></button>
   </div>
  );
}

export default Review;

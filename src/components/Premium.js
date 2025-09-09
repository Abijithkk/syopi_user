import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStarOfDavid } from '@fortawesome/free-solid-svg-icons';
import './Premium.css';

function Premium() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const clone = marquee.innerHTML;
    marquee.innerHTML += clone;

    const contentWidth = marquee.scrollWidth / 2;
    const animationDuration = contentWidth / 30;
    
    marquee.style.setProperty('--scroll-duration', `${animationDuration}s`);
    
    marquee.style.animation = 'none';
    setTimeout(() => {
      marquee.style.animation = '';
    }, 10);
  }, []);

  return (
    <div className="premium-container">
      <div className="premium-marquee" ref={marqueeRef}>
        <div className="icon-text-pair">
          <FontAwesomeIcon icon={faStarOfDavid} className="premium-icon" />
          <span className="premium-text">Premium Quality</span>
        </div>
        <div className="icon-text-pair">
          <FontAwesomeIcon icon={faStarOfDavid} className="premium-icon" />
          <span className="premium-text">Affordable price</span>
        </div>
        <div className="icon-text-pair">
          <FontAwesomeIcon icon={faStarOfDavid} className="premium-icon" />
          <span className="premium-text">Fast delivery</span>
        </div>
        <div className="icon-text-pair">
          <FontAwesomeIcon icon={faStarOfDavid} className="premium-icon" />
          <span className="premium-text">Trending Deals</span>
        </div>
        <div className="icon-text-pair">
          <FontAwesomeIcon icon={faStarOfDavid} className="premium-icon" />
          <span className="premium-text">Incredible delights</span>
        </div>

      </div>
    </div>
  );
}

export default Premium;
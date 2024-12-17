import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStarOfDavid } from '@fortawesome/free-solid-svg-icons';
import './Premium.css';

function Premium() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;

    // Clone the original content to create seamless scroll
    const clone = marquee.innerHTML;
    marquee.innerHTML += clone;

    // Dynamically set animation duration based on content width
    const contentWidth = marquee.scrollWidth / 2; // Original content width
    const animationDuration = contentWidth / 50; // Adjust speed (50px/sec)
    marquee.style.setProperty('--scroll-duration', `${animationDuration}s`);
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
          <span className="premium-text">Premium Quality</span>
        </div>
        <div className="icon-text-pair">
          <FontAwesomeIcon icon={faStarOfDavid} className="premium-icon" />
          <span className="premium-text">Premium Quality</span>
        </div>
        <div className="icon-text-pair">
          <FontAwesomeIcon icon={faStarOfDavid} className="premium-icon" />
          <span className="premium-text">Premium Quality</span>
        </div><div className="icon-text-pair">
          <FontAwesomeIcon icon={faStarOfDavid} className="premium-icon" />
          <span className="premium-text">Premium Quality</span>
        </div><div className="icon-text-pair">
          <FontAwesomeIcon icon={faStarOfDavid} className="premium-icon" />
          <span className="premium-text">Premium Quality</span>
        </div><div className="icon-text-pair">
          <FontAwesomeIcon icon={faStarOfDavid} className="premium-icon" />
          <span className="premium-text">Premium Quality</span>
        </div><div className="icon-text-pair">
          <FontAwesomeIcon icon={faStarOfDavid} className="premium-icon" />
          <span className="premium-text">Premium Quality</span>
        </div><div className="icon-text-pair">
          <FontAwesomeIcon icon={faStarOfDavid} className="premium-icon" />
          <span className="premium-text">Premium Quality</span>
        </div>
      </div>
    </div>
  );
}

export default Premium;

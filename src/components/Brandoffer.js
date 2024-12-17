import React, { useEffect, useRef } from 'react';
import './Brandoff.css';

function Brandoffer() {
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
    <div className="brandoff-container">
      <div className="brandoff-marquee" ref={marqueeRef}>
        {Array(10)
          .fill()
          .map((_, index) => (
            <div className="brand-icon-text-pair" key={index}>
              <div className="offerbrandicon">
                {/* Display the image */}
                <img
                  src="https://i.imghippo.com/files/CzG6176vWk.png"
                  alt="Brand-icon"
                  className="brand-image"
                />
              </div>
              <span className="brandoff-text">MIN. 35% OFF</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Brandoffer;

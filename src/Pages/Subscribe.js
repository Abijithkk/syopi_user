import React from 'react';
import Header from '../components/Header';
import './subscribe.css';
import sub from '../images/subscribe1.png';

function Subscribe() {
  return (
    <div>
      <Header />
      <div className="subscribe">
        <p className="sub-title">Subscribe WhatsApp Community</p>
        <div className="subscribe-content">
          <img src={sub} alt="Subscribe" className="sub-image" />
          <p className="sub-des">
            Join our WhatsApp community to connect, share, and stay updated! Get exclusive tips, resources, and be part of a supportive network. Click the link to join now and become part of our growing community!
          </p>
        </div>
        <button className="subscribe-button">Subscribe</button>
      </div>
    </div>
  );
}

export default Subscribe;
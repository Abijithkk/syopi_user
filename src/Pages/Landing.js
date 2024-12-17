import React, { useState } from 'react';
import Header from '../components/Header';
import Landingimage from '../images/Landing.jpeg';
import './Landing.css';

function Landing() {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleSignInSignUp = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className="landing-page">
      <Header />
      <div className="landing-image-container">
        <img src={Landingimage} alt="Landing" className="landing-image" />
        <div className="welcome-section">
          <div className="welcome-text">
            <h1>Welcome to <span style={{color:'#116AFD'}}>Syopi</span ></h1>
            <p>Get ready to dress your little ones in fashion-forward outfits</p>
          </div>
          <div className="auth-toggle">
            <button
              onClick={toggleSignInSignUp}
              className={`toggle-btn ${isSignIn ? 'active' : ''}`}
            >
              Sign In
            </button>
            <button
              onClick={toggleSignInSignUp}
              className={`toggle-btn ${!isSignIn ? 'active' : ''}`}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;

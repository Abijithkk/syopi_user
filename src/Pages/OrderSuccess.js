import React, { useEffect, useState, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function OrderSuccess() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const successRef = useRef(null);
  const particlesRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Trigger main visibility
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    // Trigger secondary animations
    const animationTimer = setTimeout(() => {
      setIsAnimated(true);
      
      // Create particles
      if (particlesRef.current) {
        createParticles();
      }
    }, 1000);
    
    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, []);
  const handlenavigate =()=>{
    navigate('/')
  }
  
  // Function to create particle elements
  const createParticles = () => {
    const container = particlesRef.current;
    const colors = ['#4361ee', '#3a0ca3', '#4cc9f0', '#f72585', '#7209b7'];
    const shapes = ['circle', 'square', 'triangle', 'line'];
    
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 10 + 5;
      const posX = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = Math.random() * 2 + 2;
      
      particle.className = `success-particle success-particle-${shape}`;
      particle.style.backgroundColor = color;
      particle.style.width = `${size}px`;
      particle.style.height = shape === 'line' ? '2px' : `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      
      container.appendChild(particle);
    }
  };

  return (
    <section className="success-page-wrapper">
      <div className="success-page-particles" ref={particlesRef}></div>
      
      <Container fluid className="success-page-container">
        <div className={`success-card-wrapper ${isVisible ? 'is-visible' : ''}`} ref={successRef}>
          <div className="success-card">
            <div className="success-symbol-container">
              <div className="success-symbol-outer">
                <div className="success-symbol-middle">
                  <div className="success-symbol-inner">
                    <div className="success-symbol-icon">
                      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`success-symbol-rings ${isAnimated ? 'is-animated' : ''}`}>
                <div className="success-symbol-ring success-symbol-ring-1"></div>
                <div className="success-symbol-ring success-symbol-ring-2"></div>
                <div className="success-symbol-ring success-symbol-ring-3"></div>
              </div>
            </div>
            
            <div className={`success-content ${isAnimated ? 'is-animated' : ''}`}>
              <h1 className="success-title">Order Complete</h1>
              <p className="success-message">Your purchase has been successfully processed.</p>
              
              <div className="success-separator">
                <div className="success-separator-line"></div>
                <div className="success-separator-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                </div>
                <div className="success-separator-line"></div>
              </div>
              
              <div onClick={handlenavigate} className={`success-action ${isAnimated ? 'is-animated' : ''}`}>
                <button className="success-button">
                  <span className="success-button-text">Continue Shopping</span>
                  <span className="success-button-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </button>
              </div>
            </div>          
          </div>
        </div>
      </Container>
      
      <style jsx>{`
        /* Base styles */
        .success-page-wrapper {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(125deg, #fafaff 0%, #f0f2fa 100%);
          overflow: hidden;
        }
        
        .success-page-container {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 2rem 1rem;
        }
        
        /* Particles */
        .success-page-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 5;
          overflow: hidden;
        }
        
        .success-particle {
          position: absolute;
          top: -20px;
          animation: particle-fall 4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        
        .success-particle-circle {
          border-radius: 50%;
        }
        
        .success-particle-square {
          border-radius: 2px;
        }
        
        .success-particle-triangle {
          width: 0 !important;
          height: 0 !important;
          background-color: transparent !important;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 10px solid;
          border-bottom-color: inherit;
        }
        
        .success-particle-line {
          transform: rotate(90deg);
        }
        
        @keyframes particle-fall {
          0% {
            transform: translateY(0) rotate(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        /* Card container */
        .success-card-wrapper {
          width: 100%;
          max-width: 480px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .success-card-wrapper.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .success-card {
          position: relative;
          background-color: #ffffff;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
          padding: 4rem 2rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        }
        
        /* Success symbol */
        .success-symbol-container {
          position: relative;
          width: 120px;
          height: 120px;
          margin-bottom: 2rem;
        }
        
        .success-symbol-outer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #4e56ff, #6c4fff);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .success-symbol-middle {
          width: 88%;
          height: 88%;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .success-symbol-inner {
          width: 85%;
          height: 85%;
          background-color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .success-symbol-icon {
          width: 50%;
          height: 50%;
          color: #4e56ff;
          animation: success-check 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s forwards;
          transform: scale(0);
        }
        
        @keyframes success-check {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .success-symbol-rings {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .success-symbol-rings.is-animated {
          opacity: 1;
        }
        
        .success-symbol-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 1px solid #4e56ff;
          border-radius: 50%;
          opacity: 0;
        }
        
        .success-symbol-ring-1 {
          animation: success-ring 2s ease-out 1s infinite;
        }
        
        .success-symbol-ring-2 {
          animation: success-ring 2s ease-out 1.5s infinite;
        }
        
        .success-symbol-ring-3 {
          animation: success-ring 2s ease-out 2s infinite;
        }
        
        @keyframes success-ring {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        
        /* Content */
        .success-content {
          width: 100%;
          text-align: center;
          transform: translateY(20px);
          opacity: 0;
          transition: transform 0.8s ease, opacity 0.8s ease;
          transition-delay: 0.3s;
        }
        
        .success-content.is-animated {
          transform: translateY(0);
          opacity: 1;
        }
        
        .success-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #222233;
          margin-bottom: 0.75rem;
        }
        
        .success-message {
          font-size: 1.1rem;
          color: #666677;
          margin-bottom: 2rem;
        }
        
        /* Separator */
        .success-separator {
          display: flex;
          align-items: center;
          width: 100%;
          margin: 1.5rem 0;
        }
        
        .success-separator-line {
          flex: 1;
          height: 1px;
          background-color: #e0e4f0;
        }
        
        .success-separator-icon {
          margin: 0 1rem;
          color: #a0a8c0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Button */
        .success-action {
          margin: 1.5rem 0;
          transform: translateY(20px);
          opacity: 0;
          transition: transform 0.8s ease, opacity 0.8s ease;
          transition-delay: 0.5s;
        }
        
        .success-action.is-animated {
          transform: translateY(0);
          opacity: 1;
        }
        
        .success-button {
          background: linear-gradient(to right, #4e56ff, #6c4fff);
          color: white;
          font-size: 1rem;
          font-weight: 600;
          padding: 0.9rem 2rem;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 6px 15px rgba(78, 86, 255, 0.3);
        }
        
        .success-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(78, 86, 255, 0.4);
        }
        
        .success-button:active {
          transform: translateY(-1px);
        }
        
        .success-button-text {
          margin-right: 0.5rem;
        }
        
        .success-button-icon {
          display: flex;
          align-items: center;
          transition: transform 0.3s ease;
        }
        
        .success-button:hover .success-button-icon {
          transform: translateX(4px);
        }
        
        /* Footer */
        .success-footer {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2rem;
          padding: 1.5rem;
          background-color: #f8f9fd;
          border-radius: 0 0 24px 24px;
          margin: 2rem -2rem -2rem;
          transform: translateY(20px);
          opacity: 0;
          transition: transform 0.8s ease, opacity 0.8s ease;
          transition-delay: 0.7s;
        }
        
        .success-footer.is-animated {
          transform: translateY(0);
          opacity: 1;
        }
        
        .success-footer-icon {
          color: #4e56ff;
          margin-right: 0.75rem;
          display: flex;
          align-items: center;
        }
        
        .success-footer-text {
          color: #666677;
          font-size: 0.9rem;
          margin: 0;
        }
        
        /* Responsive adjustments */
        @media (max-width: 576px) {
          .success-card {
            padding: 3rem 1.25rem 1.25rem;
          }
          
          .success-symbol-container {
            width: 100px;
            height: 100px;
            margin-bottom: 1.5rem;
          }
          
          .success-title {
            font-size: 1.8rem;
          }
          
          .success-message {
            font-size: 1rem;
          }
          
          .success-button {
            width: 100%;
          }
        }
        
        @media (max-width: 320px) {
          .success-symbol-container {
            width: 80px;
            height: 80px;
          }
          
          .success-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}

export default OrderSuccess;
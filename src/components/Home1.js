import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home1.css';
import { BASE_URL } from '../services/baseUrl';

// Simple and performant Skeleton Loader Component
const CarouselSkeleton = () => {
  return (
    <div className="home-carousel-container">
      <div className="simple-skeleton-carousel">
        {/* Main Image Skeleton */}
        <div className="simple-skeleton-image"></div>
        
        {/* Navigation Arrows Skeleton */}
        <div className="simple-skeleton-nav simple-skeleton-prev">‹</div>
        <div className="simple-skeleton-nav simple-skeleton-next">›</div>
        
        {/* Indicators Skeleton */}
        <div className="simple-skeleton-indicators">
          <div className="simple-skeleton-dot"></div>
          <div className="simple-skeleton-dot active"></div>
          <div className="simple-skeleton-dot"></div>
        </div>
      </div>
    </div>
  );
};

function Home1({ productSlider, isLoading = false }) {
  const navigate = useNavigate();
  
  const handleSliderClick = (productId) => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  // Show skeleton loader when loading or no data
  if (isLoading || !productSlider || productSlider.length === 0) {
    return <CarouselSkeleton />;
  }
  
  return (
    <div className="home-carousel-container">
      <div id="homeCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="2000">
        <div className="carousel-indicators">
          {productSlider.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#homeCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? 'active' : ''}
              aria-current={index === 0 ? 'true' : undefined}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>
        
        <div className="carousel-inner">
          {productSlider.map((item, index) => (
            <div key={item._id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <img
                src={`${BASE_URL}/uploads/${item.image}`}
                className="d-block w-100"
                alt={item.title}
                onClick={() => handleSliderClick(item.productId)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>
        
        <button className="prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
          &#10094;
        </button>
        <button className="next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
          &#10095;
        </button>
      </div>
    </div>
  );
}

export default Home1;
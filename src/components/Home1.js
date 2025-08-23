import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home1.css';
import { BASE_URL } from '../services/baseUrl';


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
  const [activeIndex, setActiveIndex] = React.useState(0);
  const carouselRef = React.useRef(null);
  const intervalRef = React.useRef(null);

  const handleSliderClick = (productSliderId) => {
    if (productSliderId) {
      navigate(`/allproducts?productSliderId=${productSliderId}`);
    }
  };

  React.useEffect(() => {
    const startCarousel = () => {
      intervalRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % productSlider.length);
      }, 3000);
    };

    if (productSlider && productSlider.length > 0) {
      startCarousel();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [productSlider]);

  if (isLoading || !productSlider || productSlider.length === 0) {
    return <CarouselSkeleton />;
  }

  return (
    <div className="home-carousel-container">
      <div className="carousel" ref={carouselRef}>
        <div className="carousel-inner">
          {productSlider.map((item, index) => (
            <div
              key={item._id}
              className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleSliderClick(item._id)} // Changed to use item._id (carousel ID)
            >
              <img
                src={`${BASE_URL}/uploads/${item.image}`}
                className="d-block w-100"
                alt={item.title}
                style={{ cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>
        
        <button
          className="prev"
          onClick={() => setActiveIndex(prev => (prev - 1 + productSlider.length) % productSlider.length)}
        >
          &#10094;
        </button>
        <button
          className="next"
          onClick={() => setActiveIndex(prev => (prev + 1) % productSlider.length)}
        >
          &#10095;
        </button>
        
        {/* <div className="carousel-indicators">
          {productSlider.map((_, index) => (
            <button
              key={index}
              type="button"
              className={index === activeIndex ? 'active' : ''}
              onClick={() => setActiveIndex(index)}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div> */}
      </div>
    </div>
  );
}

export default Home1;
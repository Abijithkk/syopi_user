import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Brand.css';
import { getSliders } from '../services/allApi';
import { BASE_IMG_URL } from '../services/baseUrl';

function Brand() {
  const [brandSliders, setBrandSliders] = useState([]);
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrandSliders = async () => {
      try {
        const data = await getSliders();
        setBrandSliders(data.brandSliders);
      } catch (error) {
        console.error('Error fetching brand sliders:', error);
      }
    };

    fetchBrandSliders();
  }, []);

  // Auto-rotate sliders every 5 seconds
  useEffect(() => {
    if (brandSliders.length > 1) {
      const interval = setInterval(() => {
        setCurrentSliderIndex((prevIndex) =>
          (prevIndex + 1) % brandSliders.length
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [brandSliders.length]);

  const currentSlider = brandSliders[currentSliderIndex];

  const handleClick = () => {
    if (currentSlider) {
      navigate(`/allproducts?brand=${currentSlider.brandId}`);
    }
  };

  if (!currentSlider) {
    return (
      <div className="brand-container">
        <div className="brand-content">
          <div className="brand-loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-container" onClick={handleClick}>
      <div className="brand-content">
        <div className="brand-image">
          <img 
            src={`${BASE_IMG_URL}/uploads/${currentSlider.image}`} 
            alt={currentSlider.title}
          />
        </div>
        <div className="brand-text">
          <p className="subheading">{currentSlider.title}</p>
          <p className="brand-name">PREMIUM BRAND</p>
          <p className="offer">Exclusive Collection</p>
        </div>
      </div>
    </div>
  );
}

export default Brand;
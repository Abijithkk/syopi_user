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
        <div className="brand-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="brand-container" onClick={handleClick}>
      <div className="image-wrapper">
        <img 
          src={`${BASE_IMG_URL}/uploads/${currentSlider.image}`} 
          alt={currentSlider.title}
          className="brand-image"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default Brand;
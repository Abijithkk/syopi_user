import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import './street.css';
import { getSliders } from '../services/allApi';
import { BASE_IMG_URL } from '../services/baseUrl';

function Street() {
  const { ref, inView } = useInView({
    threshold: 0.2,
  });
  const [sliders, setSliders] = useState([]);
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const data = await getSliders();
        setSliders(data.categorySliders);
      } catch (error) {
        console.error('Error fetching sliders:', error);
      }
    };

    fetchSliders();
  }, []);

  // Auto-rotate sliders every 5 seconds
  useEffect(() => {
    if (sliders.length > 1) {
      const interval = setInterval(() => {
        setCurrentSliderIndex((prevIndex) =>
          (prevIndex + 1) % sliders.length
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [sliders.length]);

  const currentSlider = sliders[currentSliderIndex];

  const handleClick = () => {
    if (currentSlider) {
      navigate(`/allproducts?category=${currentSlider.categoryId}&subcategory=${currentSlider.subCategoryId}`);
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="streetwear" ref={ref}>
      {currentSlider && (
        <>
          <img
            onClick={handleClick}
            src={`${BASE_IMG_URL}/uploads/${currentSlider.image}`}
            alt={currentSlider.title}
            className="street-background-image"
          />
          <div className="streetwear-overlay"></div>
        </>
      )}
      
      <div className="street-content">
        <motion.h1
          className="street-heading"
          variants={textVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {currentSlider?.title.toUpperCase() || "NEW COLLECTION"}
        </motion.h1>
        
        <motion.p
          className="street-sub-heading"
          variants={textVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Discover the latest trends in fashion
        </motion.p>
        

      </div>
    </div>
  );
}

export default Street;
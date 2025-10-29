import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./vendorproductslider.css";
import { BASE_URL } from "../services/baseUrl";

function VendorProductSlider({ bottomBanner }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = bottomBanner
    ? [
        {
          id: bottomBanner._id,
          image: `${BASE_URL}/uploads/${bottomBanner.image}`,
          topText: bottomBanner.subtitle || "Discover Now",
          title: bottomBanner.title || "Featured Collection",
          buttonText: "SHOP NOW",
        },
      ]
    : [];

  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) =>
          prev === slides.length - 1 ? 0 : prev + 1
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const handleShopNow = () => {
    if (bottomBanner?.productIds?.length > 0) {
      const productIds = bottomBanner.productIds.map(product => product._id);
      navigate(`/allproducts?productIds=${productIds.join(',')}`);
    }
  };

  if (!bottomBanner) {
    return (
      <div className="vendor-slider">
        <p className="no-banner-text">No bottom banner available</p>
      </div>
    );
  }

  return (
    <div className="vendor-slider">
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-content">
              <p className="slide-top-text">{slide.topText}</p>
              <h2 className="slide-title">{slide.title}</h2>
              <button
                className="shop-now-btn"
                onClick={handleShopNow}
              >
                SHOP NOW <i className="fa fa-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VendorProductSlider;
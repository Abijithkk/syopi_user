import { motion } from "framer-motion";
import { Slider } from "@mui/material";
import "./FilterPanel.css";
import { getBrandApi } from "../services/allApi";
import { useEffect, useState } from "react";

const FilterPanel = ({ 
  onApplyFilters, 
  price, 
  setPrice, 
  selectedProductType, 
  setSelectedProductType,
  selectedDiscount, 
  setSelectedDiscount,
  selectedBrands,
  setSelectedBrands,
  selectedRating,
  setSelectedRating,
  isFilterOpen,
  setIsFilterOpen
}) => {
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 5000
  });

  const filterVariants = {
    open: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: { 
      x: "-100%", 
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  // Fetch brands from API
  const fetchBrands = async () => {
    try {
      const response = await getBrandApi();
      if (response.data) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
    setPriceRange({
      min: 0,
      max: 5000
    });
    if (!price || !price.length) {
      setPrice([0, 5000]);
    }
  }, []);

  const handleDiscountChange = (discount) => {
    if (typeof setSelectedDiscount === 'function') {
      setSelectedDiscount(discount === selectedDiscount ? null : discount);
    } else {
      console.error("setSelectedDiscount is not a function");
    }
  };

  const handleBrandChange = (brandId) => {
    const updatedBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter(id => id !== brandId)
      : [...selectedBrands, brandId];
    
    if (typeof setSelectedBrands === 'function') {
      setSelectedBrands(updatedBrands);
    }
  };

  const handleRatingChange = (rating) => {
    if (typeof setSelectedRating === 'function') {
      setSelectedRating(rating === selectedRating ? null : rating);
    } else {
      console.error("setSelectedRating is not a function");
    }
  };

  const safeSelectedBrands = selectedBrands || [];

  return (
    <>
      {isFilterOpen && (
        <div 
          className="filter-overlay"
          onClick={() => setIsFilterOpen(false)}
        ></div>
      )}
      
      <motion.aside 
        className={`filter-panel ${isFilterOpen ? 'open' : ''}`}
        initial="closed"
        animate={isFilterOpen ? "open" : "closed"}
        variants={filterVariants}
      >
        <div className="filter-header">
          <h2>Filters</h2>
          <button 
            className="close-filter-btn"
            onClick={() => setIsFilterOpen(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="filter-content">
          <div className="filter-section">
            <h3 className="filter-title">Brands</h3>
            <div className="filter-options brand-options">
              {brands && brands.length > 0 ? (
                brands.map((brand) => (
                  <div key={brand._id} className="filter-option">
                    <input 
                      type="checkbox" 
                      id={`brand-${brand._id}`} 
                      checked={safeSelectedBrands.includes(brand._id)}
                      onChange={() => handleBrandChange(brand._id)} 
                      className="filter-checkbox"
                    />
                    <label htmlFor={`brand-${brand._id}`} className="filter-label">{brand.name}</label>
                  </div>
                ))
              ) : (
                <p className="loading-message">Loading brands...</p>
              )}
            </div>
          </div>
          
          <div className="filter-section price-filter">
            <h3 className="filter-title">Price Range</h3>
            <Slider
              value={price || [0, 5000]}
              onChange={(e, newValue) => typeof setPrice === 'function' ? setPrice(newValue) : console.error("setPrice is not a function")}
              valueLabelDisplay="auto"
              min={priceRange.min}
              max={priceRange.max}
              className="price-slider"
            />
            <div className="price-range-display">
              <span className="currency">₹</span>{price ? price[0] : 0} - <span className="currency">₹</span>{price ? price[1] : 5000}
            </div>
          </div>
          
          <div className="filter-section">
            <h3 className="filter-title">Rating</h3>
            <div className="filter-options rating-options">
              <div className="filter-option">
                <input 
                  type="radio" 
                  id="rating-1" 
                  name="rating-filter"
                  checked={selectedRating === 1}
                  onChange={() => handleRatingChange(1)}
                  className="filter-radio"
                />
                <label htmlFor="rating-1" className="filter-label">Less than 3★</label>
              </div>
              <div className="filter-option">
                <input 
                  type="radio" 
                  id="rating-2" 
                  name="rating-filter"
                  checked={selectedRating === 3}
                  onChange={() => handleRatingChange(3)}
                  className="filter-radio"
                />
                <label htmlFor="rating-2" className="filter-label">3★ to 4★</label>
              </div>
              <div className="filter-option">
                <input 
                  type="radio" 
                  id="rating-3" 
                  name="rating-filter"
                  checked={selectedRating === 4}
                  onChange={() => handleRatingChange(4)}
                  className="filter-radio"
                />
                <label htmlFor="rating-3" className="filter-label">4★ to 5★</label>
              </div>
              <div className="filter-option">
                <input 
                  type="radio" 
                  id="rating-none" 
                  name="rating-filter"
                  checked={selectedRating === null}
                  onChange={() => handleRatingChange(null)}
                  className="filter-radio"
                />
                <label htmlFor="rating-none" className="filter-label">Any Rating</label>
              </div>
            </div>
          </div>
          
          <div className="filter-section">
            <h3 className="filter-title">Discount</h3>
            <div className="filter-options discount-options">
              <div className="filter-option">
                <input 
                  type="radio" 
                  id="discount-10" 
                  name="discount-filter"
                  checked={selectedDiscount === 10}
                  onChange={() => handleDiscountChange(10)}
                  className="filter-radio"
                />
                <label htmlFor="discount-10" className="filter-label">10% or more</label>
              </div>
              <div className="filter-option">
                <input 
                  type="radio" 
                  id="discount-20" 
                  name="discount-filter"
                  checked={selectedDiscount === 20}
                  onChange={() => handleDiscountChange(20)}
                  className="filter-radio"
                />
                <label htmlFor="discount-20" className="filter-label">20% or more</label>
              </div>
              <div className="filter-option">
                <input 
                  type="radio" 
                  id="discount-30" 
                  name="discount-filter"
                  checked={selectedDiscount === 30}
                  onChange={() => handleDiscountChange(30)}
                  className="filter-radio"
                />
                <label htmlFor="discount-30" className="filter-label">30% or more</label>
              </div>
              <div className="filter-option">
                <input 
                  type="radio" 
                  id="discount-50" 
                  name="discount-filter"
                  checked={selectedDiscount === 50}
                  onChange={() => handleDiscountChange(50)}
                  className="filter-radio"
                />
                <label htmlFor="discount-50" className="filter-label">50% or more</label>
              </div>
              <div className="filter-option">
                <input 
                  type="radio" 
                  id="discount-none" 
                  name="discount-filter"
                  checked={selectedDiscount === null}
                  onChange={() => handleDiscountChange(null)}
                  className="filter-radio"
                />
                <label htmlFor="discount-none" className="filter-label">No Discount</label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="filter-actions">
          <button className="reset-btn" onClick={() => {
            if (typeof setSelectedProductType === 'function') setSelectedProductType([]);
            if (typeof setSelectedDiscount === 'function') setSelectedDiscount(null);
            if (typeof setSelectedBrands === 'function') setSelectedBrands([]);
            if (typeof setSelectedRating === 'function') setSelectedRating(null);
            if (typeof setPrice === 'function') setPrice([priceRange.min, priceRange.max]);
          }}>
            Reset All
          </button>
          <button className="apply-btn" onClick={onApplyFilters}>
            Apply 
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default FilterPanel;
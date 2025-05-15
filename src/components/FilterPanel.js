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
      console.log("Brands", response);
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

  const handleProductTypeChange = (type) => {
    setSelectedProductType((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const handleDiscountChange = (discount) => {
    setSelectedDiscount(discount === selectedDiscount ? null : discount);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand]
    );
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating === selectedRating ? null : rating);
  };

  const renderSizeOptions = () => {
    if (selectedProductType.includes("dress")) {
      return ["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
        <div key={size} className="filter-option">
          <input 
            type="checkbox" 
            id={`size-${size}`} 
            className="filter-checkbox" 
          />
          <label htmlFor={`size-${size}`} className="filter-label">{size}</label>
        </div>
      ));
    }
    
    if (selectedProductType.includes("chappal")) {
      return ["6", "7", "8", "9", "10", "11", "12"].map((size) => (
        <div key={size} className="filter-option">
          <input 
            type="checkbox" 
            id={`size-${size}`} 
            className="filter-checkbox" 
          />
          <label htmlFor={`size-${size}`} className="filter-label">{size}</label>
        </div>
      ));
    }
    
    return (
      <p className="no-sizes-message">Select a product type to see available sizes</p>
    );
  };

  return (
    <>
      <button 
        className="filter-toggle-btn"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <i className="fas fa-filter"></i>
        <span>Filters</span>
      </button>
      
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
            <h3 className="filter-title">Product Type</h3>
            <div className="filter-options">
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  id="type-dress" 
                  checked={selectedProductType.includes("dress")}
                  onChange={() => handleProductTypeChange("dress")}
                  className="filter-checkbox"
                />
                <label htmlFor="type-dress" className="filter-label">Dress</label>
              </div>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  id="type-chappal" 
                  checked={selectedProductType.includes("chappal")}
                  onChange={() => handleProductTypeChange("chappal")}
                  className="filter-checkbox"
                />
                <label htmlFor="type-chappal" className="filter-label">Chappal</label>
              </div>
            </div>
          </div>
          
          {/* Brand Filter Section */}
          <div className="filter-section">
            <h3 className="filter-title">Brands</h3>
            <div className="filter-options brand-options">
              {brands && brands.length > 0 ? (
                brands.map((brand) => (
                  <div key={brand._id} className="filter-option">
                    <input 
                      type="checkbox" 
                      id={`brand-${brand._id}`} 
                      checked={selectedBrands && selectedBrands.includes(brand._id)}
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
          
          <div className="filter-section">
            <h3 className="filter-title">Size</h3>
            <div className="filter-options size-options">
              {renderSizeOptions()}
            </div>
          </div>
          
          <div className="filter-section price-filter">
            <h3 className="filter-title">Price Range</h3>
            <Slider
              value={price}
              onChange={(e, newValue) => setPrice(newValue)}
              valueLabelDisplay="auto"
              min={priceRange.min}
              max={priceRange.max}
              className="price-slider"
            />
            <div className="price-range-display">
              <span className="currency">₹</span>{price[0]} - <span className="currency">₹</span>{price[1]}
            </div>
          </div>
          
          {/* Rating Filter Section */}
          <div className="filter-section">
            <h3 className="filter-title">Rating</h3>
            <div className="filter-options rating-options">
              <div className="filter-option">
                <input 
                  type="radio" 
                  id="rating-1" 
                  name="rating"
                  checked={selectedRating === "less-than-3"}
                  onChange={() => handleRatingChange("less-than-3")}
                  className="filter-radio"
                />
                <label htmlFor="rating-1" className="filter-label">Less than 3★</label>
              </div>
              <div className="filter-option">
                <input 
                  type="radio" 
                  id="rating-2" 
                  name="rating"
                  checked={selectedRating === "3-to-4"}
                  onChange={() => handleRatingChange("3-to-4")}
                  className="filter-radio"
                />
                <label htmlFor="rating-2" className="filter-label">3★ to 4★</label>
              </div>
              <div className="filter-option">
                <input 
                  type="radio" 
                  id="rating-3" 
                  name="rating"
                  checked={selectedRating === "4-to-5"}
                  onChange={() => handleRatingChange("4-to-5")}
                  className="filter-radio"
                />
                <label htmlFor="rating-3" className="filter-label">4★ to 5★</label>
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
                  name="discount"
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
                  name="discount"
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
                  name="discount"
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
                  name="discount"
                  checked={selectedDiscount === 50}
                  onChange={() => handleDiscountChange(50)}
                  className="filter-radio"
                />
                <label htmlFor="discount-50" className="filter-label">50% or more</label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="filter-actions">
          <button className="reset-btn" onClick={() => {
            setSelectedProductType([]);
            setSelectedDiscount(null);
            setSelectedBrands([]);
            setSelectedRating(null);
            setPrice([priceRange.min, priceRange.max]);
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
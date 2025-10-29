import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./vendorCategories.css";
import { BASE_URL } from "../services/baseUrl";
import frame from "../images/border_frame.png";

function VendorCategories({ subcategories = [] }) {
  const navigate = useNavigate();
  const { id } = useParams(); 

  if (!subcategories || subcategories.length === 0) {
    return (
      <div className="vendorCategoriesWrapper">
        <p className="no-categories-text">No categories available</p>
      </div>
    );
  }

  const handleCategoryClick = (subcategoryId) => {
    navigate(`/allproducts?subcategory=${subcategoryId}&vendorId=${id}`);
  };

  return (
    <div className="vendorCategoriesWrapper">
      <div className={`vendorCategoriesGrid ${subcategories.length === 1 ? 'single-card' : ''}`}>
        {subcategories.map((category) => (
          <div 
            key={category._id} 
            className="vendorCategoryCard"
            onClick={() => handleCategoryClick(category._id)}
            style={{ cursor: "pointer" }} // Add pointer cursor for better UX
          >
            <div className="vendorCardFrame">
              <img
                src={`${BASE_URL}/uploads/${category.image}`}
                alt={category.name}
                className="vendorCardImage"
              />
              {/* Frame overlay - positioned as border */}
              <img
                src={frame}
                alt="frame"
                className="vendorCardFrameBorder"
              />
              <div className="vendorCardContent">
                <h3 className="vendorCardTitle">{category.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VendorCategories;
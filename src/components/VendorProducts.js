import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Pages/VendorDetails.css";
import { BASE_URL } from "../services/baseUrl";

function VendorProducts({ banners = [] }) {
  const navigate = useNavigate();

  // Fallback in case no data
  if (!banners || banners.length === 0) {
    return (
      <div className="inbox-fashion-container">
        <p className="no-products-text">No product banners available</p>
      </div>
    );
  }

  const handleShopNow = (banner) => {
    // Extract product IDs from the banner
    const productIds = banner.productIds.map(product => product._id);
    
    // Navigate to allproducts page with product IDs and vendor ID
    navigate(`/allproducts?productIds=${productIds.join(',')}`);
  };

  return (
    <div className="inbox-fashion-container">
      <div className="inbox-fashion-content">
        <div className="inbox-products-scroll">
          {banners.map((banner, index) => (
            <div key={index} className="inbox-product-item">
              <div
                className="inbox-product-image"
                style={{
                  backgroundImage: `url(${BASE_URL}/uploads/${banner.image})`,
                }}
              >
                <div className="inbox-product-overlay">
                  <h3 className="inbox-product-name">{banner.title}</h3>
                  <h5 className="inbox-product-category">{banner.subtitle}</h5>
                  <button 
                    className="inbox-shop-now"
                    onClick={() => handleShopNow(banner)}
                  >
                    Shop Now <i className="fa fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VendorProducts;
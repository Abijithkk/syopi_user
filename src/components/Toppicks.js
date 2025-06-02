import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Toppicks.css";
import { BASE_URL } from "../services/baseUrl";

function Toppicks({ products }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithKey = (url) => {
    const separator = url.includes('?') ? '&' : '?';
    const uniqueUrl = `${url}${separator}_k=${Date.now()}`;
    navigate(uniqueUrl);
  };

  const handleProductClick = (product) => {
    const params = new URLSearchParams(location.search);
    const currentSearch = params.get("search");
    
    let url = `/allproducts?category=${product.category}`;
    
    if (product.subcategory) {
      url += `&subcategory=${product.subcategory}`;
    }
    
    if (currentSearch) {
      url += `&search=${currentSearch}`;
    }
    
    navigateWithKey(url);
  };

  return (
    <div className="Toppicks">
      <p className="Toppicksheading1">Your top picks in the best price</p>
      <div className="Toppicks-card-row">
        {products.map((product) => (
          <div 
            className="Toppicks-card" 
            key={product._id || product.id}
            onClick={() => handleProductClick(product)}
            style={{ cursor: 'pointer' }}
          >
            <div className="Toppicks-card-image-container">
              <img
                src={`${BASE_URL}/uploads/${product.image}`}
                alt={product.title}
                className="Toppicks-card-image"
              />
              <div className="card-text-overlay">
                <p className="Toppicksheading">{product.title}</p>
                <p className="Toppickssubheading">{product.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="product-prev"
        type="button"
        data-bs-target="#homeCarousel"
        data-bs-slide="prev"
      >
        &#10094;
      </button>
      <button
        className="product-next"
        type="button"
        data-bs-target="#homeCarousel"
        data-bs-slide="next"
      >
        &#10095;
      </button>
    </div>
  );
}

export default Toppicks;
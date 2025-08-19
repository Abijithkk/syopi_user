import React from "react";
import { useNavigate } from "react-router-dom";
import "./trending.css";
import { BASE_URL } from "../services/baseUrl";

function Trending({ products }) {
  const navigate = useNavigate();

  const handleCardClick = (product) => {
    const minPrice = product.affordablePrice;

    navigate(`/allproducts?minPrice=${minPrice}&_k=${Date.now()}`);
  };

  return (
    <div className="trending">
      <p className="trendingheading">Trending deals under 1000₹</p>
      <div className="trending-card-row">
        {products.map((product) => (
          <div
            className="trending-card"
            key={product._id || product.id}
            onClick={() => handleCardClick(product)}
            style={{ cursor: "pointer" }}
          >
            <div className="trending-card-image-container">
              <img
                src={`${BASE_URL}/uploads/${product.image}`}
                alt={product.title}
                className="trending-card-image"
              />
            </div>
            <p className="trending-card-title">{product.description}</p>
            <p className="trending-card-description">
              From {product.affordablePrice}
            </p>
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

export default Trending;

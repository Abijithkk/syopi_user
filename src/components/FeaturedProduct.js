import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import {
  addWishlistApi,
  getProductApi,
  getWishlistApi,
  removefromWishlist,
} from "../services/allApi";

import "./FProduct.css";
import { BASE_URL } from "../services/baseUrl";

function FeaturedProduct() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { ref, inView } = useInView({ threshold: 0.2 });
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProductApi();
      console.log("productresponse", response);

      setProducts(response.data.products);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await getWishlistApi();
        console.log(response);

        if (response?.data?.wishlist) {
          setWishlist(
            new Set(
              response.data.wishlist.map((item) => String(item.productId._id))
            )
          );
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = async (id) => {
    const token = localStorage.getItem("accessuserToken");
  
    if (!token) {
      navigate("/signin");
      return;
    }
  
    try {
      let response;
      
      if (wishlist.has(String(id))) {
        // If already wishlisted, remove from wishlist
        response = await removefromWishlist(id);
      } else {
        // Otherwise, add to wishlist
        response = await addWishlistApi(id);
      }
  
      console.log("Wishlist Response:", response);
  
      if (!response.success) {
        console.error("Failed to toggle wishlist:", response.error);
        return;
      }
  
      // Update the `isWishlisted` state in the products array
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id
            ? { ...product, isWishlisted: !product.isWishlisted }
            : product
        )
      );
  
      // Update local wishlist state
      setWishlist((prevWishlist) => {
        const updatedWishlist = new Set(prevWishlist);
        if (updatedWishlist.has(String(id))) {
          updatedWishlist.delete(String(id));
        } else {
          updatedWishlist.add(String(id));
        }
        return updatedWishlist;
      });
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    }
  };
  

  const handleNavigate = useCallback(
    (id) => {
      navigate(`/product/${id}`);
    },
    [navigate]
  );

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, duration: 0.8 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 15 },
    },
  };

  const wishlistVariants = {
    active: {
      scale: 1.2,
      color: "#e63946",
      transition: { type: "spring", stiffness: 300 },
    },
    inactive: { scale: 1, color: "#333" },
  };

  return (
    <motion.div
      ref={ref}
      className="fproduct"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.p
        className="fproductheading"
        initial={{ opacity: 0, y: -30 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        }}
      >
        Featured Products
      </motion.p>

      {loading ? (
        <div className="feature-card-row">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="feature-card skeleton-loader"></div>
          ))}
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchProducts} className="retry-button">
            Retry
          </button>
        </div>
      ) : (
        <div className="feature-card-row">
          {products.map((product) => (
            <motion.div
              className="feature-card"
              key={product._id}
              variants={cardVariants}
              onClick={() => handleNavigate(product._id)}
            >
              <div className="feature-card-image-container">
                <img
                  src={`${BASE_URL}/uploads/${product.images[0]}`}
                  alt={product.title}
                  className="feature-card-image"
                  loading="lazy"
                />
                <motion.div
                  className={`wishlist-icon ${
                    wishlist.has(String(product._id)) ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product._id);
                  }}
                  variants={wishlistVariants}
                  animate={
                    wishlist.has(String(product._id)) ? "active" : "inactive"
                  }
                >
                  <i
                    className={
                      wishlist.has(String(product._id))
                        ? "fa-solid fa-heart"
                        : "fa-regular fa-heart"
                    }
                  ></i>
                </motion.div>
              </div>
              <p className="feature-card-title">{product.name}</p>
            </motion.div>
          ))}
        </div>
      )}

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
    </motion.div>
  );
}

export default FeaturedProduct;

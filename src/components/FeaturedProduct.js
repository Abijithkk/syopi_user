import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  addWishlistApi,
  getWishlistApi,
  removefromWishlist,
} from "../services/allApi";

import "./FProduct.css";
import { BASE_URL } from "../services/baseUrl";

function FeaturedProduct({ products = [] }) {
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { ref, inView } = useInView({ threshold: 0.2 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await getWishlistApi();

        if (response?.data?.wishlist) {
          setWishlist(
            new Set(
              response.data.wishlist.map((item) => String(item.productId._id))
            )
          );
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        setError("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = async (id, productName = "Product") => {
    const token = localStorage.getItem("accessuserToken");
  
    if (!token) {
      toast.error("Please sign in to add items to wishlist", {
        duration: 3000,
        position: "top-center",
      });
      navigate("/signin");
      return;
    }

    const isCurrentlyWishlisted = wishlist.has(String(id));
    const loadingToastId = toast.loading(
      isCurrentlyWishlisted ? "Removing from wishlist..." : "Adding to wishlist...",
      {
        position: "top-center",
      }
    );
  
    try {
      let response;
      
      if (isCurrentlyWishlisted) {
        response = await removefromWishlist(id);
      } else {
        response = await addWishlistApi(id);
      }
  
  
      if (!response.success) {
        console.error("Failed to toggle wishlist:", response.error);
        toast.error("Failed to update wishlist. Please try again.", {
          id: loadingToastId,
          duration: 3000,
          position: "top-center",
        });
        return;
      }
  
      setWishlist((prevWishlist) => {
        const updatedWishlist = new Set(prevWishlist);
        if (updatedWishlist.has(String(id))) {
          updatedWishlist.delete(String(id));
        } else {
          updatedWishlist.add(String(id));
        }
        return updatedWishlist;
      });

      if (isCurrentlyWishlisted) {
        toast.success(`${productName} removed from wishlist`, {
          id: loadingToastId,
          duration: 2000,
          position: "top-center",
          icon: "💔",
        });
      } else {
        toast.success(`${productName} added to wishlist`, {
          id: loadingToastId,
          duration: 2000,
          position: "top-center",
          icon: "❤️",
        });
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
      toast.error("Something went wrong. Please try again.", {
        id: loadingToastId,
        duration: 3000,
        position: "top-center",
      });
      setError("Failed to update wishlist");
    }
  };

  const handleNavigate = useCallback(
    (id) => {
      navigate(`/product/${id}`);
    },
    [navigate]
  );

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

  const isLoading = loading && products.length === 0;
  const truncateText = (text, maxLength = 25) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
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

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button 
            onClick={() => setError(null)} 
            className="retry-button"
          >
            Dismiss
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="feature-card-row">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="feature-card skeleton-loader"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="no-products-message">
          <p>No featured products available</p>
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
                  src={`${BASE_URL}/uploads/${product.images?.[0] || 'placeholder.jpg'}`}
                  alt={product.title || product.name || 'Product'}
                  className="feature-card-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
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
              <p className="feature-card-title">
              {truncateText(product.name)}
              </p>
              
            </motion.div>
          ))}
        </div>
      )}

      {products.length > 0 && (
        <>
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
        </>
      )}
    </motion.div>
  );
}

export default FeaturedProduct;
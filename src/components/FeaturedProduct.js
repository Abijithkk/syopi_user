import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import "./FProduct.css";
import fp1 from "../images/fp1.jpeg";
import fp2 from "../images/fp2.jpeg";
import fp3 from "../images/fp3.jpeg";
import fp4 from "../images/fp4.jpeg";

function FeaturedProduct() {
  const [wishlist, setWishlist] = useState({});
  const { ref, inView } = useInView({ threshold: 0.2 });
  const navigate = useNavigate();

  const products = [
    { id: 1, image: fp1, title: "Product 1", description: "This is product 1" },
    { id: 2, image: fp2, title: "Product 2", description: "This is product 2" },
    { id: 3, image: fp3, title: "Product 3", description: "This is product 3" },
    { id: 4, image: fp4, title: "Product 4", description: "This is product 4" },
    { id: 5, image: fp3, title: "Product 5", description: "This is product 5" },
    { id: 6, image: fp2, title: "Product 6", description: "This is product 6" },
  ];

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, duration: 0.8 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 15 },
    },
  };

  console.log("FeaturedProduct component rendered");
  console.log("Products:", products);
  console.log("Wishlist state:", wishlist);
  console.log("InView state:", inView);
  const wishlistVariants = {
    active: { scale: 1.2, color: "#e63946", transition: { type: "spring", stiffness: 300 } },
    inactive: { scale: 1, color: "#333" },
  };

  const handleNavigate = (id) => {
    navigate(`/product/${id}`);
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
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
      >
        Featured Products
      </motion.p>
      <div className="feature-card-row">
        {products.map((product) => (
          <motion.div
            className="feature-card"
            key={product.id}
            variants={cardVariants}
            onClick={() => handleNavigate(product.id)}
          >
            <div className="feature-card-image-container">
              <img
                src={product.image}
                alt={product.title}
                className="feature-card-image"
              />
              <motion.div
                className={`wishlist-icon ${wishlist[product.id] ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                variants={wishlistVariants}
                animate={wishlist[product.id] ? "active" : "inactive"}
              >
                <i
                  className={
                    wishlist[product.id]
                      ? "fa-solid fa-heart"
                      : "fa-regular fa-heart"
                  }
                ></i>
              </motion.div>
            </div>
            <p className="feature-card-title">{product.title}</p>
            <p className="feature-card-description">{product.description}</p>
          </motion.div>
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
    </motion.div>
  );
}

export default FeaturedProduct;

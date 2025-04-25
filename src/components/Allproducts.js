import React, { useState, useEffect, useCallback, useContext } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import {
  addWishlistApi,
  getProductApi,
  getWishlistApi,
} from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";
import { SearchContext } from "./SearchContext";
import "./Allproduct.css";
import { Slider } from "@mui/material";
import Skeleton from "react-loading-skeleton";
import { ToastContainer } from "react-toastify";

function Allproducts() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery, searchResults } = useContext(SearchContext);
  const { ref, inView } = useInView({ threshold: 0.2 });
  const navigate = useNavigate();
  const [price, setPrice] = useState([0, 1000]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProductApi();
      console.log("Product response:", response);
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

  const displayedProducts = searchQuery ? searchResults : products;


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
      const response = await addWishlistApi(id);
      console.log("Wishlist Response:", response);
      if (!response.success) {
        console.error("Failed to toggle wishlist:", response.error);
        return;
      }
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id
            ? { ...product, isWishlisted: !product.isWishlisted }
            : product
        )
      );
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

  // Calculate filler count to always complete a row of 4 columns.
  const totalColumns = 4;
  const fillerCount =
    displayedProducts.length > 0
      ? (totalColumns - (displayedProducts.length % totalColumns)) %
        totalColumns
      : 0;
  const fillers = Array.from({ length: fillerCount });

  // Animation Variants (feel free to adjust)
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
  const [selectedProductType, setSelectedProductType] = useState([]);


// Memoize buildQueryParams to avoid warning
const buildQueryParams = useCallback(() => {
  const params = new URLSearchParams();

  if (searchQuery) params.append("search", searchQuery);
  if (selectedProductType.length > 0) {
    params.append("productTypes", selectedProductType.join(","));
  }
  params.append("priceMin", price[0]);
  params.append("priceMax", price[1]);
  if (selectedDiscount) {
    params.append("discountMin", selectedDiscount);
  }

  return params.toString();
}, [searchQuery, selectedProductType, price, selectedDiscount]);

const fetchFilteredProducts = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    const queryParams = buildQueryParams();
    const response = await getProductApi(queryParams);
    if (response.success) {
      setProducts(response.data.products);
    } else {
      setProducts([]);
    }
  } catch (err) {
    setError("Failed to load products. Please try again.");
  } finally {
    setLoading(false);
  }
}, [buildQueryParams]);

  // Handle Apply Filters
  const handleApplyFilters = () => {
    fetchFilteredProducts();
    navigate(`/allproducts?${buildQueryParams()}`);
  };
  const handleDiscountChange = (discount) => {
    setSelectedDiscount(discount);
  };
  const handleProductTypeChange = (type) => {
    setSelectedProductType((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const renderSizeOptions = () => {
    if (selectedProductType.includes("dress")) {
      return ["S", "M", "L", "XL"].map((size) => (
        <label key={size} className="unique-filter-label">
          <input type="checkbox" value={size} /> {size}
        </label>
      ));
    }
    if (selectedProductType.includes("chappal")) {
      return ["6", "7", "8", "9", "10"].map((size) => (
        <label key={size} className="unique-filter-label">
          <input type="checkbox" value={size} /> {size}
        </label>
      ));
    }
    return null;
  };
  return (
    <div>
      <motion.div
        ref={ref}
        className="allproduct"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {loading ? (
          <div className="allproduct-container">
            {/* Left: Filter Skeleton */}
            <div className="filter-section">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} height={40} borderRadius={8} />
              ))}
            </div>

            {/* Center: Product Skeleton */}
            <div className="product-section">
              {[...Array(8)].map((_, index) => (
                <Skeleton key={index} height={220} borderRadius={12} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchProducts} className="retry-button">
              Retry
            </button>
          </div>
        ) : displayedProducts.length === 0 && searchQuery ? (
          <div className="nr-container">
            <div className="nr-card">
              {/* Icon Section */}
              <div className="nr-icon-wrapper">
                <div className="nr-icon-bg"></div>
                <div className="nr-icon-fg">
                  {/* Replace the SVG below with your custom icon */}
                  <svg viewBox="0 0 24 24" className="nr-icon-svg">
                    <path d="M10,2A8,8,0,1,0,18,10,8.009,8.009,0,0,0,10,2Zm0,14A6,6,0,1,1,16,10,6.007,6.007,0,0,1,10,16ZM21.707,20.293l-5.375-5.375a1,1,0,1,0-1.414,1.414l5.375,5.375a1,1,0,0,0,1.414-1.414Z" />
                  </svg>
                </div>
              </div>

              {/* Main Message */}
              <div className="nr-title">No Results Found</div>
              <div className="nr-message">
                We couldn’t find any matches for{" "}
                <span className="nr-search-query">"your search"</span>.
              </div>

              {/* Suggestions */}
              <div className="nr-suggestions">
                <div className="nr-suggestions-title">Try these tips:</div>
                <ul className="nr-suggestions-list">
                  <li className="nr-suggestion-item">
                    Check for spelling errors
                  </li>
                  <li className="nr-suggestion-item">
                    Use fewer or different keywords
                  </li>
                  <li className="nr-suggestion-item">
                    Try broader search terms
                  </li>
                  <li className="nr-suggestion-item">Remove any filters</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="nr-buttons">
                <button className="nr-btn nr-btn-clear">Clear Search</button>
                <button className="nr-btn nr-btn-home">Return Home</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="unique-products-container">
            {/* Left Filter Section */}
            <aside className="unique-filter-panel">
              <h3 className="unique-filter-title">Filter Products</h3>

              {/* Product Type Filter */}
              <div className="unique-filter-group">
                <h4 className="unique-filter-group-title">Product Type</h4>
                <label className="unique-filter-label">
                  <input
                    type="checkbox"
                    value="dress"
                    onChange={() => handleProductTypeChange("dress")}
                  />{" "}
                  Dress
                </label>
                <label className="unique-filter-label">
                  <input
                    type="checkbox"
                    value="chappal"
                    onChange={() => handleProductTypeChange("chappal")}
                  />{" "}
                  Chappal
                </label>
              </div>

              {/* Size Filter */}
              <div className="unique-filter-group">
                <h4 className="unique-filter-group-title">Sizes</h4>
                {renderSizeOptions()}
              </div>

              {/* Price Filter */}
              <div className="unique-filter-group">
                <h4 className="unique-filter-group-title">Price Range</h4>
                <Slider
                  value={price}
                  onChange={(e, newValue) => setPrice(newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                />
                <div className="price-value">
                  ${price[0]} - ${price[1]}
                </div>
              </div>

              {/* Discount Filter */}
              <div className="unique-filter-group">
          <h4 className="unique-filter-group-title">Discount</h4>
          <label className="unique-filter-label">
            <input
              type="radio"
              name="discount"
              value="10"
              onChange={() => handleDiscountChange(10)}
            />{" "}
            10% or more
          </label>
          <label className="unique-filter-label">
            <input
              type="radio"
              name="discount"
              value="20"
              onChange={() => handleDiscountChange(20)}
            />{" "}
            20% or more
          </label>
          <label className="unique-filter-label">
            <input
              type="radio"
              name="discount"
              value="30"
              onChange={() => handleDiscountChange(30)}
            />{" "}
            30% or more
          </label>
        </div>

        {/* Apply Button */}
        <div className="unique-filter-group">
          <button onClick={handleApplyFilters} className="unique-apply-button">
            Apply Filters
          </button>
        </div>
            </aside>

            {/* Main Content Section */}
            <div className="unique-main-content">
              {/* Top Sort Section */}
              <div className="unique-sort-bar">
                <label
                  htmlFor="unique-sort-select"
                  className="unique-sort-label"
                >
                  Sort by:
                </label>
                <select id="unique-sort-select" className="unique-sort-select">
                  <option value="popularity">Popularity</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              {/* Product Cards Section */}
              <div className="unique-product-list">
                <div className="allproduct-card-row">
                  {displayedProducts.map((product) => (
                    <motion.div
                      className="allproduct-card"
                      key={product._id}
                      variants={cardVariants}
                      onClick={() => handleNavigate(product._id)}
                    >
                      <div className="allproduct-card-image-container">
                        <img
                          src={`${BASE_URL}/uploads/${product.images[0]}`}
                          alt={product.title}
                          className="allproduct-card-image"
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
                            wishlist.has(String(product._id))
                              ? "active"
                              : "inactive"
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
                      <div className="allproduct-card">
                        <p className="allproduct-card-title">{product.name}</p>
                        <div className="allproduct-card-pricing">
                          <p className="price">₹{product.variants[0].price}</p>
                          {product.variants[0].offerPrice && (
                            <p className="offer-price">
                              ₹{product.variants[0].offerPrice}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Render invisible fillers if the last row is incomplete */}
                  {fillers.map((_, index) => (
                    <div
                      key={`filler-${index}`}
                      className="allproduct-card filler"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default Allproducts;

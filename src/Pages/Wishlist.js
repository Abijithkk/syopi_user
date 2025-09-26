import React, { useState, useEffect, useRef, useCallback } from "react";
import ContentLoader from "react-content-loader";
import { toast } from "react-hot-toast";
import "./wishlist.css";
import { getWishlistApi, removefromWishlist, addToCartApi } from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";
import { Link, useNavigate } from "react-router-dom";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedColorName, setSelectedColorName] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();
  
  // Ref to track if auth error toast has been shown
  const authErrorShownRef = useRef(false);
  // Ref to track navigation timeout
  const navigationTimeoutRef = useRef(null);

  const handleAuthError = (message = "Please sign in to view your wishlist") => {
    // Prevent multiple auth error toasts
    if (authErrorShownRef.current) return;
    
    authErrorShownRef.current = true;
    toast.error(message);
    
    // Clear invalid tokens
    localStorage.removeItem("accessuserToken");
    localStorage.removeItem("userId");
    
    // Clear any existing navigation timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    
    // Navigate to signin after showing toast
    navigationTimeoutRef.current = setTimeout(() => {
      navigate("/signin");
    }, 1000);
  };

  const fetchWishlist = async () => {
    try {
      const response = await getWishlistApi();
      console.log("Wishlist response:", response);

      if (response?.error === "No token provided" ||
          response?.error === "Login Required." ||
          response?.error?.includes("Login Required") ||
          response?.error?.includes("Unauthorized") ||
          response?.error?.includes("No token provided") ||
          response?.status === 401) {
        
        handleAuthError();
        return;
      }

      if (response.success) {
        setWishlist(response.data.wishlist);
        console.log(response);
        

        const initialStatus = response.data.wishlist.reduce((acc, item) => {
          acc[item._id] = true;
          return acc;
        }, {});
        setWishlistStatus(initialStatus);
      } else {
        // Handle other non-success responses
        toast.error(response.error || "Failed to load wishlist");
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      
      // Handle authentication errors in catch block
      if (error.response?.status === 401 || 
          error.response?.data?.error === "No token provided" ||
          error.response?.data?.error === "Login Required." ||
          error.message?.includes("401") || 
          error.message?.includes("Unauthorized") ||
          error.message?.includes("Login Required") ||
          error.message?.includes("No token provided")) {
        
        handleAuthError("Session expired. Please sign in again.");
      } else {
        toast.error("Failed to load wishlist");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    
    // Cleanup function
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);
  
  const handleNavigate = useCallback(
    (id) => {
      navigate(`/product/${id}`);
    },
    [navigate]
  );
  
  const handleRemoveFromWishlist = async (id) => {
    try {
      // Prevent multiple clicks on the same item
      if (!wishlistStatus[id]) return;
      
      setWishlistStatus((prev) => ({
        ...prev,
        [id]: false,
      }));

      const response = await removefromWishlist(id);

      if (response.success) {
        // Remove the item from the wishlist array
        setWishlist((prevWishlist) =>
          prevWishlist.filter((item) => item._id !== id)
        );
        toast.success("Item removed from wishlist");
      } else {
        // Revert the wishlist status if the API call fails
        setWishlistStatus((prev) => ({
          ...prev,
          [id]: true,
        }));
        toast.error("Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      // Revert the wishlist status if there's an error
      setWishlistStatus((prev) => ({
        ...prev,
        [id]: true,
      }));
      toast.error("Failed to remove from wishlist");
    }
  };

  // Open popup for selecting color and size
  const openAddToCartPopup = (product) => {
    setSelectedProduct(product);
    setSelectedColor("");
    setSelectedColorName("");
    setSelectedSize("");
    setShowPopup(true);
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedProduct(null);
  };

  // Handle color selection
  const handleColorSelect = (color, colorName) => {
    setSelectedColor(color);
    setSelectedColorName(colorName);
    setSelectedSize(""); // Reset size when color changes
  };

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Add to cart function
  const addToCart = async () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select a color and size before adding to cart.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please log in to add items to your cart");
      setTimeout(() => navigate("/signin"), 1500);
      return;
    }

    setIsAddingToCart(true);

    try {
      const response = await addToCartApi(
        userId,
        selectedProduct._id,
        1,
        selectedColor,
        selectedColorName,
        selectedSize
      );

      // Check for authentication failure (based on your API response format)
      if (
        response?.error === "No token provided" ||
        response?.error === "Login Required." ||
        response?.error?.includes("Login Required") ||
        response?.error?.includes("Unauthorized") ||
        response?.error?.includes("No token provided") ||
        response?.status === 401
      ) {
        toast.error("Please sign in ");

        // Clear invalid tokens
        localStorage.removeItem("accessuserToken");
        localStorage.removeItem("userId");

        setTimeout(() => navigate("/signin"), 1500);
        return;
      }

      if (response.success) {
        toast.success("Product added to cart successfully!");
        closePopup();
      } else {
        if (response.status === 401) {
          toast.error("Session expired. Redirecting to login...");
          localStorage.removeItem("accessuserToken");
          localStorage.removeItem("userId");
          setTimeout(() => navigate("/signin"), 1500);
        } else {
          toast.error(response.message || "Failed to add product to cart");
        }
      }
    } catch (error) {
      // Handle authentication errors in catch block
      if (
        error.response?.status === 401 ||
        error.response?.data?.error === "No token provided" ||
        error.response?.data?.error === "Login Required." ||
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized") ||
        error.message?.includes("Login Required") ||
        error.message?.includes("No token provided")
      ) {
        toast.error("Session expired. Please sign in again.");

        localStorage.removeItem("accessuserToken");
        localStorage.removeItem("userId");

        setTimeout(() => navigate("/signin"), 1500);
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Get unique colors from variants
  const getUniqueColors = (product) => {
    if (!product || !product.variants || product.variants.length === 0) return [];
    
    const colors = [];
    const colorMap = new Map();
    
    product.variants.forEach(variant => {
      if (variant.color && !colorMap.has(variant.color)) {
        colorMap.set(variant.color, true);
        colors.push({
          color: variant.color,
          colorName: variant.colorName || variant.color
        });
      }
    });
    
    return colors;
  };

  // Get available sizes for selected color
  const getAvailableSizes = (product) => {
    if (!product || !selectedColor || !product.variants || product.variants.length === 0) return [];
    
    const variant = product.variants.find(v => v.color === selectedColor);
    if (!variant || !variant.sizes) return [];
    
    return variant.sizes.filter(size => size.stock > 0).map(size => size.size);
  };

  return (
    <div>
      {loading ? (
        <div className="wishlist">
          <p className="wishlist-heading">
            My Wishlist{" "}
            <span className="wishlist-heading-span">
              ({wishlist.length} items)
            </span>
          </p>
          <div className="wishlist-card-row">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="no-wishlist container">
          <div className="wishlist-icon2">
            <i className="fa-regular fa-heart"></i>
          </div>
          <p className="empty-wishlist">Your wishlist is empty.</p>
          <p className="empty-wishlist-des">
            You don't have any products in the wishlist yet. You will find a lot
            of interesting products on our Shop page.
          </p>
          <Link to={'/'}>
            <button className="wishlist-button">
              <span className="wishlist-button-text">Continue Shopping</span>
            </button>
          </Link>
        </div>
      ) : (
        <div className="wishlist">
          <p className="wishlist-heading">
            My Wishlist{" "}
            <span className="wishlist-heading-span">
              ({wishlist.filter(item => item.productId).length} items)
            </span>
          </p>
          <div className="wishlist-card-row">
            {wishlist.map((item) => {
              // Check if product is null/removed
              if (!item.productId) {
                return (
                  <div className="wishlist-card wishlist-card-removed" key={item._id}>
                    <div className="feature-card-image-container">
                      <div className="wishlist-removed-image">
                        <i className="fa-solid fa-ban"></i>
                      </div>
                      <div
                        className={`wishlist-icon ${wishlistStatus[item._id] ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromWishlist(item._id);
                        }}
                      >
                        <i className="fa-solid fa-heart"></i>
                      </div>
                    </div>
                    <p className="wishlist-card-title">Product Removed</p>
                    <p className="wishlist-card-description">
                      This item is no longer available
                    </p>
                    <div className="price-container2">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="current-price">N/A</span>
                      </div>
                    </div>
                    <button 
                      className="wishlist-add-to-cart-btn wishlist-add-to-cart-disabled"
                      disabled
                    >
                      Unavailable
                    </button>
                  </div>
                );
              }

              const product = item.productId;
              const mainVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
              
              return (
                <div className="wishlist-card" key={item._id}>
                  <div className="feature-card-image-container">
                    <img
                      src={`${BASE_URL}/uploads/${product.images[0]}`}
                      alt={product.name}
                      className="wishlist-card-image"
                      onClick={() => handleNavigate(product._id)}
                    />
                    <div
                      className={`wishlist-icon ${wishlistStatus[item._id] ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWishlist(item._id);
                      }}
                    >
                      <i className="fa-solid fa-heart"></i>
                    </div>
                  </div>
                  <p className="wishlist-card-title">{product.brandName || product.brand}</p>
                  <p className="wishlist-card-description">
                    {product.name}
                  </p>
                  <div className="price-container2">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="current-price">
                        ₹
                        {product.offers?.length > 0 && mainVariant
                          ? mainVariant.offerPrice
                          : mainVariant?.price || product.defaultPrice || "N/A"}
                      </span>

                      {mainVariant?.wholesalePrice && (
                        <span className="wholesale-price">
                          ₹{mainVariant.wholesalePrice}
                        </span>
                      )}

                      {product.discountPercentage > 0 && (
                        <span className="discount-badge">
                          {product.discountPercentage}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    className="wishlist-add-to-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddToCartPopup(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Popup for selecting color and size */}
      {showPopup && selectedProduct && (
        <div className="wishlist-popup-overlay">
          <div className="wishlist-popup">
            <div className="wishlist-popup-header">
              <h3>Select Options</h3>
              <button className="wishlist-popup-close" onClick={closePopup}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="wishlist-popup-content">
              <div className="wishlist-popup-options">
                {/* Color selection */}
                <div className="wishlist-popup-section">
                  <p className="wishlist-popup-label">Select Color: {selectedColorName}</p>
                  <div className="wishlist-popup-colors">
                    {getUniqueColors(selectedProduct).map((colorObj, index) => (
                      <div
                        key={index}
                        className={`wishlist-popup-color-option ${
                          selectedColor === colorObj.color ? "selected" : ""
                        }`}
                        style={{
                          backgroundColor: colorObj.color.replace(/`/g, ""),
                        }}
                        onClick={() => handleColorSelect(colorObj.color, colorObj.colorName)}
                        title={colorObj.colorName}
                      />
                    ))}
                  </div>
                </div>

                {/* Size selection - only show if color is selected */}
                {selectedColor && (
                  <div className="wishlist-popup-section">
                    <p className="wishlist-popup-label">Select Size</p>
                    <div className="wishlist-popup-sizes">
                      {getAvailableSizes(selectedProduct).map((size, index) => (
                        <div
                          key={index}
                          className={`wishlist-popup-size-option ${
                            selectedSize === size ? "selected" : ""
                          }`}
                          onClick={() => handleSizeSelect(size)}
                        >
                          {size}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button 
                className="wishlist-popup-add-btn"
                onClick={addToCart}
                disabled={!selectedColor || !selectedSize || isAddingToCart}
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SkeletonCard = () => (
  <ContentLoader
    speed={2}
    width={250}
    height={350}
    viewBox="0 0 250 350"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    className="wishlist-card"
  >
    <rect x="0" y="0" rx="12" ry="12" width="250" height="280" />
    <rect x="10" y="295" rx="4" ry="4" width="200" height="15" />
    <rect x="10" y="320" rx="4" ry="4" width="150" height="15" />
  </ContentLoader>
);

export default Wishlist;
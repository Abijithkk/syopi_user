import React, { useState, useEffect, useRef } from "react";
import ContentLoader from "react-content-loader";
import { toast } from "react-hot-toast";
import "./wishlist.css";
import { getWishlistApi, removefromWishlist } from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";
import { Link, useNavigate } from "react-router-dom";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [loading, setLoading] = useState(true);
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
      console.log("wishlist", response);

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
          prevWishlist.filter((item) => item.productId?._id !== id)
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
              ({wishlist.length} items)
            </span>
          </p>
          <div className="wishlist-card-row">
            {wishlist.map((item) => (
              <div className="wishlist-card" key={item._id}>
                <div className="wishlist-card-image-container">
                  <img
                    src={`${BASE_URL}/uploads/${item.productId.images[0]}`}
                    alt={item.productId.name}
                    className="wishlist-card-image"
                  />
                  <div
                    className={`wishlist-icon ${
                      wishlistStatus[item._id] ? "active" : ""
                    }`}
                    onClick={() =>
                      handleRemoveFromWishlist(item.productId?._id)
                    }
                  >
                    <i
                      className={
                        wishlistStatus[item._id]
                          ? "fa-solid fa-heart"
                          : "fa-regular fa-heart"
                      }
                    ></i>
                  </div>
                </div>
                <p className="wishlist-card-title">{item.productId.name}</p>
                <p className="wishlist-card-description">
                  {item.productId.productType}
                </p>
              </div>
            ))}
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
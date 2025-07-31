import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ContentLoader from "react-content-loader";
import toast from "react-hot-toast";
import "./Similarproduct.css";
import { addWishlistApi, getSimilarProductApi, getWishlistApi, removefromWishlist } from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";

function SimilarProduct() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchSimilarProducts(id);
    }
  }, [id]);

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

  const fetchSimilarProducts = async (productId) => {
    setLoading(true);
    try {
      const response = await getSimilarProductApi(productId);

      if (response.status === 200 && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
    setLoading(false);
  };

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
      window.scrollTo(0, 0);
    },
    [navigate]
  );

  const handleWishlistClick = (e, productId, productName) => {
    e.stopPropagation(); // Prevent navigation when clicking wishlist icon
    toggleWishlist(productId, productName);
  };

  // Helper function to get price display
  const getPriceDisplay = (product) => {
    if (product?.variants?.length > 0) {
      const variant = product.variants[0];
      return {
        offerPrice: variant.offerPrice,
        wholesalePrice: variant.wholesalePrice
      };
    }
    return {
      offerPrice: product.defaultPrice,
      wholesalePrice: null
    };
  };

  // Scroll functions for horizontal navigation
  const scrollLeft = () => {
    const container = document.querySelector('.similar-card-row');
    if (container) {
      container.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    const container = document.querySelector('.similar-card-row');
    if (container) {
      container.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="similar-product">
      <p className="similarproductheading">Similar Products</p>
      {loading ? (
        <div className="similar-card-row">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="similar-card-row">
          {products.map((product) => {
            const { offerPrice, wholesalePrice } = getPriceDisplay(product);
            
            return (
              <div
                className="similar-card"
                key={product._id}
                onClick={() => handleNavigate(product._id)}
              >
                <div className="similar-card-image-container">
                  <img
                    src={`${BASE_URL}/uploads/${product.images[0]}`}
                    alt={product.name}
                    className="similar-card-image"
                  />
                  <div
                    className={`wishlist-icon ${
                      wishlist.has(String(product._id)) ? "active" : ""
                    }`}
                    onClick={(e) => handleWishlistClick(e, product._id, product.name)}
                  >
                    <i
                      className={
                        wishlist.has(String(product._id))
                          ? "fa-solid fa-heart"
                          : "fa-regular fa-heart"
                      }
                    ></i>
                  </div>
                </div>
                <p className="similar-card-title">
                  {product.name.length > 15
                    ? product.name.slice(0, 15) + "..."
                    : product.name}
                </p>
                <div className="similar-card-price">
                  <span className="offer-price">₹{offerPrice}</span>
                  {wholesalePrice && (
                    <span className="wholesale-price">₹{wholesalePrice}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-products">No similar products found.</div>
      )}

      <button className="product-prev" type="button" onClick={scrollLeft}>
        &#10094;
      </button>
      <button className="product-next" type="button" onClick={scrollRight}>
        &#10095;
      </button>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

const SkeletonCard = () => (
  <ContentLoader
    speed={2}
    width={200}
    height={300}
    viewBox="0 0 200 300"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    className="similar-card"
  >
    <rect x="0" y="0" rx="12" ry="12" width="200" height="230" />
    <rect x="10" y="245" rx="4" ry="4" width="180" height="15" />
    <rect x="10" y="270" rx="4" ry="4" width="130" height="15" />
  </ContentLoader>
);

export default SimilarProduct;
import React, { useEffect, useMemo, useState } from "react";
import "./singleproduct.css";
// import Rating from "../components/Rating";
// import Review from "../components/Review";
import SimilarProduct from "../components/SimilarProduct";
import Footer from "../components/Footer";
import {
  addToCartApi,
  buyNowCheckoutApi,
  getDeliveryDateApi,
  getProductByIdApi,
  getUserCartApi,
} from "../services/allApi";

import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../services/baseUrl";
import { Skeleton } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { toast } from "react-hot-toast";

function SingleProduct() {
  const [zoomBackgroundPosition, setZoomBackgroundPosition] = useState({});
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedColorName, setSelectedColorName] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [brandName, setBrandName] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [currentImages, setCurrentImages] = useState([]);
  const [isInCart, setIsInCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  // const [address, setAddress] = useState([]);
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [discount, setDiscount] = useState(null);
const [clickedSizes, setClickedSizes] = useState(new Set());

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessuserToken");
    setIsLoggedIn(!!userId && !!token);
  }, []);

  useEffect(() => {
    const fetchProductAndCartData = async () => {
      try {
        const response = await getProductByIdApi(id);

        if (response.data) {
          setProduct(response.data.product);
          setDiscount(response.data.discountPercentage);

          setBrandName(response.data.brandName || response.data.product.brand);
          setReviews(response.data.reviews);
          if (
            response.data.product.variants &&
            response.data.product.variants.length > 0
          ) {
            const firstVariant = response.data.product.variants[0];
            setSelectedColor(firstVariant.color);
            setSelectedColorName(firstVariant.colorName || "");

            const variantImages = firstVariant.images || [];
            const productImages = response.data.product.images || [];
            const imagesToUse =
              variantImages.length > 0 ? variantImages : productImages;
            setCurrentImages(imagesToUse);
            setMainImage(imagesToUse[0] || "");

            if (firstVariant.sizes && firstVariant.sizes.length > 0) {
              setSelectedSize(firstVariant.sizes[0].size);
            }
          } else {
            setCurrentImages(response.data.product.images || []);
            setMainImage(response.data.product.images?.[0] || "");
          }

          await checkIfInCart(response.data.product._id);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Failed to load product details");
      }
    };

    fetchProductAndCartData();
  }, [id]);

  const checkIfInCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await getUserCartApi(userId);
      if (response.success && response.cart) {
        const isItemInCart = response.cart.items.some(
          (item) =>
            item.productId === productId &&
            item.color === selectedColor &&
            item.size === selectedSize
        );
        setIsInCart(isItemInCart);
      }
    } catch (error) {
      console.error("Error checking cart status:", error);
    }
  };

  useEffect(() => {
    if (product) {
      checkIfInCart(product._id);
    }
  }, [selectedColor, selectedSize, product]);


  const allColors = useMemo(
    () =>
      product?.variants.map((variant) => ({
        color: variant.color,
        colorName: variant.colorName || variant.color,
      })) || [],
    [product]
  );

  const selectedVariant = useMemo(
    () => product?.variants.find((v) => v.color === selectedColor),
    [product, selectedColor]
  );

  // Update images when variant changes
  useEffect(() => {
    if (selectedVariant) {
      // If variant has images, use them, otherwise fall back to product images
      const variantImages = selectedVariant.images || [];
      const productImages = product?.images || [];
      const imagesToUse =
        variantImages.length > 0 ? variantImages : productImages;

      setCurrentImages(imagesToUse);
      setMainImage(imagesToUse[0] || "");
    }
  }, [selectedVariant, product]);

 const sizesForSelectedColor = useMemo(
  () =>
    selectedVariant?.sizes
      ?.filter(s => s.stock > 0) // Filter out sizes with 0 stock
      .map((s) => ({
        size: s.size,
        stock: s.stock,
        isAvailable: s.stock > 0,
      })) || [],
  [selectedVariant]
);
useEffect(() => {
  if (sizesForSelectedColor.length > 0 && !selectedSize) {
    setSelectedSize(sizesForSelectedColor[0].size);
  }
}, [sizesForSelectedColor, selectedSize]);

  const currentPrice =
    product?.offers?.length > 0
      ? selectedVariant?.offerPrice
      : selectedVariant?.price || product?.defaultPrice || "N/A";

  const originalPrice = selectedVariant?.wholesalePrice || 0;

  useEffect(() => {
    if (!sizesForSelectedColor.some((s) => s.size === selectedSize)) {
      const availableSize = sizesForSelectedColor.find((s) => s.isAvailable);
      setSelectedSize(availableSize ? availableSize.size : null);
    }
  }, [selectedColor, sizesForSelectedColor, selectedSize]);

  const handleSmallImageClick = (clickedImage) => {
    setMainImage(clickedImage);
  };

  const handleColorSelect = (color, colorName) => {
    setSelectedColor(color);
    setSelectedColorName(colorName || color);
  };

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

    if (isInCart) {
      navigate("/cart");
      return;
    }

    setIsLoading(true);

    try {
      const response = await addToCartApi(
        userId,
        product._id,
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
        setIsInCart(true);
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
      setIsLoading(false);
    }
  };

const handleBuyNow = async () => {
  if (!selectedColor || !selectedSize) {
    toast.error("Please select a color and size before buying.");
    return;
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
    toast.error("Please log in to proceed with purchase");
    setTimeout(() => navigate("/signin"), 1500);
    return;
  }

  setIsBuyNowLoading(true);

  try {
    const buyNowData = {
      productId: id,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
      colorName: selectedColorName,
      price: currentPrice,
    };

    const response = await buyNowCheckoutApi(buyNowData);

  
    if (response.success) {
      setTimeout(() => {
        navigate(`/address/${response.data.checkout?._id}`);
      }, 1000);
    } else {
      if (response.status === 401) {
        toast.error("Session expired. Redirecting to login...");
        localStorage.removeItem("accessuserToken");
        localStorage.removeItem("userId");
        setTimeout(() => navigate("/signin"), 1500);
      } else {
        toast.error(response.message || "Failed to proceed with purchase");
      }
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";
    toast.error(errorMessage);
    console.error("Failed to process buy now:", error);
  } finally {
    setIsBuyNowLoading(false);
  }
};


  const handleMouseEnter = (e) => {
    if (!mainImage) return;

    const safeImageURL = mainImage
      .replace(/\s/g, "%20")
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
    const imageUrl = `${BASE_URL}/uploads/${safeImageURL}`;

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setZoomBackgroundPosition({
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "250%",
        backgroundPosition: "center",
      });
      setIsZoomVisible(true);
    };

    img.onerror = () => {
      console.error("Failed to load image for zoom:", imageUrl);
      setIsZoomVisible(false);
    };
  };

  const handleMouseMove = (e) => {
    if (!mainImage || !isZoomVisible) return;

    const safeImageURL = mainImage
      .replace(/\s/g, "%20")
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
    const imageUrl = `${BASE_URL}/uploads/${safeImageURL}`;

    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomBackgroundPosition((prev) => ({
      ...prev,
      backgroundImage: `url(${imageUrl})`,
      backgroundPosition: `${x}% ${y}%`,
    }));
  };

  const handleMouseLeave = () => {
    setIsZoomVisible(false);
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPincode(value);
    if (deliveryInfo) setDeliveryInfo(null);
    if (error) setError(null);
  };

  const checkDelivery = async () => {
    if (pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getDeliveryDateApi(pincode);
      if (response.data.success) {
        setDeliveryInfo(response.data);
      } else {
        setError(
          response.data.message || "Unable to check delivery for this pincode"
        );
      }
    } catch (err) {
      setError("Service unavailable. Please try again later.");
      console.error("Delivery check error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div>
        <div className="product-container" style={{ padding: "20px" }}>
          <div className="left-col">
            <Skeleton variant="rectangular" width={400} height={400} />
            <div className="small-images">
              {[...Array(4)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width={80}
                  height={80}
                />
              ))}
            </div>
          </div>

          <div className="right-col">
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={30} />
            <Skeleton variant="text" width="50%" height={20} />

            <Skeleton variant="rectangular" width="80%" height={30} />
            <Skeleton variant="text" width="70%" height={20} />
            <Skeleton variant="rectangular" width="100%" height={40} />

            <div className="action-cards">
              <Skeleton variant="rectangular" width={150} height={50} />
              <Skeleton variant="rectangular" width={150} height={50} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const rating = product.averageRating;
  const totalRatings = reviews?.length || 0;

  return (
    <div className="single-product">
      <div className="singleproduct">
        <div className="product-container">
          {/* Left Column */}
          <div className="left-col">
            <div
              className="big-image"
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={`${BASE_URL}/uploads/${mainImage}`}
                alt="Product"
                className="main-image"
              />
            </div>

            <div className="small-images">
              {currentImages.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={`${BASE_URL}/uploads/${image}`}
                  alt={`Product ${index + 1}`}
                  onClick={() => handleSmallImageClick(image)}
                  className={mainImage === image ? "selected-thumbnail" : ""}
                />
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="right-col">
            {/* <h1 className="product-title">{product.name}</h1> */}
            <h1 className="product-title">{brandName}</h1>
            <h3 className="product-title2">{product.name}</h3>

            <div className="rating-section">
              <span className="rating-number">{rating}</span>
              <div className="stars">
                <i
                  className={`fa-star ${
                    Math.round(rating) >= 1 ? "fas" : "far"
                  }`}
                ></i>
              </div>

              <span
                className={`stock-status ${
                  selectedSize
                    ? sizesForSelectedColor.find((s) => s.size === selectedSize)
                        ?.stock > 5
                      ? "in-stock"
                      : sizesForSelectedColor.find(
                          (s) => s.size === selectedSize
                        )?.stock > 0
                      ? "limited-stock"
                      : "out-of-stock"
                    : "select-size"
                }`}
              >
                {selectedSize
                  ? sizesForSelectedColor.find((s) => s.size === selectedSize)
                      ?.stock > 5
                    ? "In stock"
                    : sizesForSelectedColor.find((s) => s.size === selectedSize)
                        ?.stock > 0
                    ? "Limited stock"
                    : "Out of stock"
                  : "Select size"}
              </span>
            </div>
            <div className="price-section">
              <p className="discounted-price">₹{currentPrice}</p>

              <>
                <p className="original-price">
                  MRP <span className="strike">₹{originalPrice}</span>
                </p>
                <p>{discount}% OFF</p>
              </>
            </div>
            {/* <div>
              
            </div> */}
            {/* <div className="points-section">
              <p className="points-line">
                You can get 40 Syopi Points on this purchase.
              </p>
              <p className="points-subline">
                Use it to save on your next order.{" "}
                <span className="how-link">How?</span>
              </p>
            </div> */}

            {/* Color Section */}
            <div className="color-section">
              <p className="select-color">Select Color: {selectedColorName}</p>
              <div className="color-options">
                {allColors.map((colorObj, index) => (
                  <div
                    key={index}
                    className={`color-circle ${
                      selectedColor === colorObj.color ? "selected" : ""
                    }`}
                    style={{
                      backgroundColor: colorObj.color.replace(/`/g, ""),
                    }} /* Remove backticks if present */
                    onClick={() =>
                      handleColorSelect(colorObj.color, colorObj.colorName)
                    }
                    title={colorObj.colorName}
                  />
                ))}
              </div>
            </div>

            {/* Size Section */}
<div className="size-section">
  <p className="select-size">Select Size:</p>
  <div className="size-options">
    {sizesForSelectedColor.map((sizeObj, index) => (
      <div
        key={index}
        className={`size-circle ${
          selectedSize === sizeObj.size ? "selected" : ""
        } ${!sizeObj.isAvailable ? "out-of-stock" : ""}`}
        onClick={() => {
          if (!sizeObj.isAvailable) return;
          
          // Toggle between showing size and checkmark
          if (selectedSize === sizeObj.size && clickedSizes.has(sizeObj.size)) {
            // If already selected and clicked, show size again but keep selected
            setClickedSizes(prev => {
              const newSet = new Set(prev);
              newSet.delete(sizeObj.size);
              return newSet;
            });
          } else {
            // Select the size and show checkmark
            setSelectedSize(sizeObj.size);
            setClickedSizes(prev => new Set(prev).add(sizeObj.size));
          }
        }}
        title={
          !sizeObj.isAvailable
            ? "Out of Stock"
            : `${sizeObj.stock} available`
        }
      >
        {/* Show checkmark only if selected AND clicked, otherwise show size */}
        {selectedSize === sizeObj.size && clickedSizes.has(sizeObj.size) ? (
          <i className="fas fa-check"></i>
        ) : (
          sizeObj.size
        )}
      </div>
    ))}
  </div>
</div>

            {/* Action Cards Section */}
            <div className="action-cards">
              <div
                className={`action-card ${
                  isInCart ? "go-to-cart" : "addtocart"
                }`}
                onClick={addToCart}
                disabled={isLoading}
              >
                <div className="icon-container">
                  <i
                    className={`fas ${
                      isInCart ? "fa-shopping-cart" : "fa-cart-plus"
                    }`}
                  ></i>
                  <p className="add-to-cart-text">
                    {isLoading
                      ? "Adding..."
                      : isInCart
                      ? "Go to Cart"
                      : "Add to Cart"}
                  </p>
                </div>
              </div>

              <div
                className="action-card buy-now"
                onClick={handleBuyNow}
                disabled={isBuyNowLoading || !selectedColor || !selectedSize}
              >
                <div className="icon-container">
                  <i className="fa-solid fa-bag-shopping"></i>
                  <p className="wishlist-text">
                    {isBuyNowLoading ? "Processing..." : "Buy Now"}
                  </p>
                </div>
              </div>
            </div>
            {/* Replace the current description section with this code */}

            <div className="product-details">
              <h2 className="details-heading">Product Details</h2>
              <ul className="details-list">
                {product.features && (
                  <>
                    {product.features.netWeight &&
                      product.features.netWeight !== "N/A" && (
                        <li>
                          <span className="feature-label">Net Weight:</span>{" "}
                          {product.features.netWeight}
                        </li>
                      )}
                    {product.features.material && (
                      <li>
                        <span className="feature-label">Material:</span>{" "}
                        {product.features.material}
                      </li>
                    )}
                    {product.features.soleMaterial && (
                      <li>
                        <span className="feature-label">Sole Material:</span>{" "}
                        {product.features.soleMaterial}
                      </li>
                    )}
                    {product.features.fit && product.features.fit !== "N/A" && (
                      <li>
                        <span className="feature-label">Fit:</span>{" "}
                        {product.features.fit}
                      </li>
                    )}
                    {product.features.occasion &&
                      product.features.occasion !== "N/A" && (
                        <li>
                          <span className="feature-label">Occasion:</span>{" "}
                          {product.features.occasion}
                        </li>
                      )}
                    {product.features.sleevesType &&
                      product.features.sleevesType !== "N/A" && (
                        <li>
                          <span className="feature-label">Sleeves Type:</span>{" "}
                          {product.features.sleevesType}
                        </li>
                      )}
                    {product.features.length &&
                      product.features.length !== "N/A" && (
                        <li>
                          <span className="feature-label">Length:</span>{" "}
                          {product.features.length}
                        </li>
                      )}
                  </>
                )}
              </ul>
            </div>

            <div className="product-description-section">
              <h2 className="description-heading">About Product</h2>
              <div className="description-content">
                {product.description.split("\n").map((paragraph, index) => (
                  <p key={index} className="description-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: product?.CODAvailable ? "#28a745" : "#dc3545", // green or red
                backgroundColor: product?.CODAvailable ? "#e6f4ea" : "#fcebea",
                padding: "8px 12px",
                borderRadius: "8px",
                width: "fit-content",
              }}
            >
              <span style={{ fontSize: "16px" }}>
                {product?.CODAvailable ? "✅" : "❌"}
              </span>
              <span>
                {product?.CODAvailable
                  ? "Cash on Delivery Available"
                  : "Cash on Delivery Not Available"}
              </span>
            </div>

            <div className="delivery-checker">
              <h2 className="details-heading">Check Delivery</h2>
              <div className="delivery-input-container">
                <div className="pincode-input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={handlePincodeChange}
                    className="pincode-input"
                    aria-label="Pincode"
                  />
                  <button
                    onClick={checkDelivery}
                    disabled={loading || pincode.length !== 6}
                    className="check-button"
                  >
                    {loading ? "Checking..." : "Check"}
                  </button>
                </div>

                {error && <p className="delivery-error">{error}</p>}

                {deliveryInfo && (
                  <div className="delivery-result">
                    <div className="delivery-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                    <div className="delivery-message">
                      <span className="delivery-status">
                        {deliveryInfo.deliveryMessage}
                      </span>
                      <span className="delivery-pincode">
                        Delivery to: {deliveryInfo.pincode}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* <Rating reviews={reviews} />
            <Review reviews={reviews} /> */}

            <div
              className="zoomed-image-container"
              style={{ display: isZoomVisible ? "block" : "none" }}
            >
              <div
                className="zoomed-image"
                style={{
                  ...zoomBackgroundPosition,
                  width: "100%",
                  height: "100%",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <SimilarProduct></SimilarProduct>
      <Footer></Footer>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default SingleProduct;

import React, { useEffect, useMemo, useState } from "react";
import "./singleproduct.css";
import Rating from "../components/Rating";
import Review from "../components/Review";
import SimilarProduct from "../components/SimilarProduct";
import Footer from "../components/Footer";
import { addToCartApi, getProductByIdApi } from "../services/allApi";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../services/baseUrl";
import { Skeleton } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";


function SingleProduct() {
  const [zoomBackgroundPosition, setZoomBackgroundPosition] = useState({});
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductByIdApi(id);
        console.log("singleproduct",response);

        if (response.data) {
          setProduct(response.data.product);
          setMainImage(response.data.product.images?.[0] || "");
          if (response.data.product.variants.length > 0) {
            setSelectedColor(response.data.variants[0].color);
          }
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const allColors = useMemo(
    () => product?.variants.map((variant) => variant.color) || [],
    [product]
  );

  // Memoized selected variant
  const selectedVariant = useMemo(
    () => product?.variants.find((v) => v.color === selectedColor),
    [product, selectedColor]
  );

  // Memoized available sizes for the selected color
  const sizesForSelectedColor = useMemo(
    () => selectedVariant?.sizes.map((s) => s.size) || [],
    [selectedVariant]
  );

  // Memoized price details
  const originalPrice = selectedVariant?.price || 0;
  const discountedPrice = selectedVariant?.offerPrice || originalPrice;
  const discountAmount = originalPrice - discountedPrice;

  // Automatically reset size if not available in new color selection
  useEffect(() => {
    if (!sizesForSelectedColor.includes(selectedSize)) {
      setSelectedSize(sizesForSelectedColor[0] || null);
    }
  }, [selectedColor, sizesForSelectedColor, selectedSize]);

  const handleSmallImageClick = (clickedImage) => {
    // Update main image to the clicked image
    setMainImage(clickedImage);

    // Update the product images array to swap positions
    setProduct((prev) => {
      const newImages = [...prev.images];
      const mainImageIndex = 0;
      const clickedImageIndex = newImages.indexOf(clickedImage);

      // Swap the positions
      [newImages[mainImageIndex], newImages[clickedImageIndex]] = [
        newImages[clickedImageIndex],
        newImages[mainImageIndex],
      ];

      return {
        ...prev,
        images: newImages,
      };
    });
  };

  const addToCart = async () => {
    if (!selectedColor || !selectedSize) {
      toast.warn("Please select a color and size before adding to cart.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Session expired. Please log in again.");
      setTimeout(() => navigate("/login"), 1500); // Redirect after delay
      return;
    }

    try {
      const response = await addToCartApi(
        userId,
        product._id, // Correct productId
        1, // Set quantity to 1
        selectedColor,
        selectedSize
      );

      if (response.success) {
        toast.success("Product added to cart successfully!");
      } else {
        if (response.status === 401) {
          toast.error("Session expired. Redirecting to login...");
          localStorage.removeItem("accessuserToken");
          localStorage.removeItem("userId");
          setTimeout(() => navigate("/signin"), 1500);
        } else {
          toast.error(
            response.error || "Failed to add product to cart. Please try again."
          );
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Failed to add product to cart:", error);
    }
  };

  if (!product) {
    return (
      <div>
        <div className="product-container" style={{ padding: "20px" }}>
          {/* Left Column Skeleton */}
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

          {/* Right Column Skeleton */}
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

    // Use the same URL encoding for consistency
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
  const rating = 4.2;
  const totalRatings = 300;

  return (
    <div className="single-product">
      <div className="singleproduct">
        <p className="product-path">
          Home / Women's Clothing / Outerwear / Jackets
        </p>
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
              {product.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={`${BASE_URL}/uploads/${image}`}
                  alt={`Product ${index + 2}`}
                  onClick={() => handleSmallImageClick(image)}
                />
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="right-col">
            <h1 className="product-title">{product.name}</h1>
            <div className="rating-section">
              <span className="rating-number">{rating}</span>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fa-star ${
                      i < Math.round(rating) ? "fas" : "far"
                    }`}
                  ></i>
                ))}
              </div>

              <span className="total-ratings">{totalRatings} ratings</span>
              <span
                className={`stock-status ${
                  product.totalStock > 0 ? "in-stock" : "out-of-stock"
                }`}
              >
                {product.totalStock > 0 ? "In stock" : "Out of stock"}
              </span>
            </div>
            <div className="price-section">
              <p className="discounted-price">₹{discountedPrice}</p>
              <p className="original-price">
                MRP <span className="strike">₹{originalPrice}</span>
              </p>
              <p className="discount-amount">(₹{discountAmount} OFF)</p>
            </div>
            <div className="points-section">
              <p className="points-line">
                You can get 40 Syopi Points on this purchase.
              </p>
              <p className="points-subline">
                Use it to save on your next order.{" "}
                <span className="how-link">How?</span>
              </p>
            </div>
            {/* Size Section */}
            <div className="size-options">
              {sizesForSelectedColor.map((size, index) => (
                <div
                  key={index}
                  className={`size-circle ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </div>
              ))}
            </div>

            {/* Color Section */}
            <div className="color-section">
              <p className="select-color">Select Color:</p>
              <div className="color-options">
                {allColors.map((color, index) => (
                  <div
                    key={index}
                    className={`color-circle ${
                      selectedColor === color ? "selected" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            {/* Two Cards Section */}
            <div className="action-cards">
              <div className="action-card addtocart" onClick={addToCart}>
                <div className="icon-container">
                  <i className="fas fa-cart-plus"></i>
                  <p className="add-to-cart-text">Add to Cart</p>
                </div>
              </div>

              <div className="action-card">
                <div className="icon-container">
                  <i className="fas fa-heart"></i>
                  <p className="wishlist-text">Add to Wishlist</p>
                </div>
              </div>
            </div>
            <div className="product-details">
              <h2 className="details-heading">Product Details</h2>
              <ul className="details-list">
                {product.features && (
                  <>
                    <li>
                      <span className="feature-label">Material:</span>{" "}
                      {product.features.material || "N/A"}
                    </li>
                    <li>
                      <span className="feature-label">Net Weight:</span>{" "}
                      {product.features.netWeight || "N/A"}
                    </li>
                    <li>
                      <span className="feature-label">Fit:</span>{" "}
                      {product.features.fit || "N/A"}
                    </li>
                    <li>
                      <span className="feature-label">Occasion:</span>{" "}
                      {product.features.occasion || "N/A"}
                    </li>
                    <li>
                      <span className="feature-label">Sleeves Type:</span>{" "}
                      {product.features.sleevesType || "N/A"}
                    </li>
                    <li>
                      <span className="feature-label">Length:</span>{" "}
                      {product.features.length || "N/A"}
                    </li>
                  </>
                )}
              </ul>
            </div>

            <Rating></Rating>
            <Review></Review>
            <div
              className="zoomed-image-container"
              style={{ display: isZoomVisible ? "block" : "none" }}
            >
              <div
                className="zoomed-image"
                style={{
                  ...zoomBackgroundPosition,
                  width: "100%", // Make sure it fills the container
                  height: "100%", // Make sure it fills the container
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

import React, { useState } from "react";
import "./singleproduct.css";
import Header from "../components/Header";
import pr1 from "../images/product1.jpeg";
import Rating from "../components/Rating";
import Review from "../components/Review";
import SimilarProduct from "../components/SimilarProduct";
import Footer from "../components/Footer";

function SingleProduct() {
  const [magnifierStyle, setMagnifierStyle] = useState({});
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const handleMove = (e) => {
    // Check if it's a touch event or mouse event
    const event = e.type === 'touchmove' ? e.touches[0] : e; // Use the first touch if it's a touch event
    const rect = e.target.getBoundingClientRect(); // Get the image position
    const x = event.clientX - rect.left; // X-coordinate relative to the image
    const y = event.clientY - rect.top; // Y-coordinate relative to the image
  
    // Calculate background position for magnified area
    const bgPosX = (x / rect.width) * 100;
    const bgPosY = (y / rect.height) * 100;
  
    setMagnifierStyle({
      left: `${x - 60}px`, // Center the magnifier
      top: `${y - 60}px`,
      backgroundImage: `url(${pr1})`, // Use the same image as the zoomed background
      backgroundPosition: `${bgPosX}% ${bgPosY}%`,
      backgroundSize: "600px 900px", 
    });
  };
  

  const rating = 4.2;
  const totalRatings = 300;
  const inStock = true;
  const discountedPrice = 1299;
  const originalPrice = 2999;
  const discountAmount = originalPrice - discountedPrice;

  return (
    <div className="single-product">
      <Header />
      <div className="singleproduct">
        <p className="product-path">Home / Women's Clothing / Outerwear / Jackets</p>
        <div className="product-container">
          {/* Left Column */}
          <div className="left-col">
          <div
  className="big-image"
  onMouseMove={handleMove}
  onTouchMove={handleMove}  // Handle touchmove for touch devices
  onMouseLeave={() => setMagnifierStyle({})} // Reset magnifier on mouse leave
  onTouchEnd={() => setMagnifierStyle({})} // Reset magnifier on touch end
>
  <img src={pr1} alt="Product" className="main-image" />
  <div className="magnifier" style={magnifierStyle}></div>
</div>

            <div className="small-images">
              <img src={pr1} alt="Product 1" />
              <img src={pr1} alt="Product 2" />
              <img src={pr1} alt="Product 3" />
              <img src={pr1} alt="Product 4" />
              <img src={pr1} alt="Product 5" />
            </div>
          </div>

          {/* Right Column */}
          <div className="right-col">
            <h1 className="product-title">Drawstring Color Block Long Sleeve Jacket</h1>
            <div className="rating-section">
              <span className="rating-number">{rating}</span>
              <div className="stars">
  {[...Array(5)].map((_, i) => (
    <i
      key={i}
      className={`fa-star ${i < Math.round(rating) ? "fas" : "far"}`}
    ></i>
  ))}
</div>

              <span className="total-ratings">{totalRatings} ratings</span>
              <span className={`stock-status ${inStock ? "in-stock" : "out-of-stock"}`}>
                {inStock ? "In stock" : "Out of stock"}
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
  <p className="points-line">You can get  40 Syopi Points on this purchase.</p>
  <p className="points-subline">Use it to save on your next order. <span className="how-link">How?</span></p>
</div>
{/* Size Section */}
<div className="size-section">
      <p className="select-size">Select Size</p>
      <div className="size-options">
        {sizes.map((size, index) => (
          <div
            key={index}
            className={`size-circle ${selectedSize === size ? "selected" : ""}`}
            onClick={() => setSelectedSize(size)} // Handle selection
          >
            {size}
          </div>
        ))}
      </div>
    </div>
{/* Color Section */}
<div className="color-section">
  <p className="select-color">Select Color:</p>
  <div className="color-options">
    {["#F5A385", "#61B97C", "#6F89C8", "#E1B74D", "#D76A7A", "#B9D89B"].map((color, index) => (
      <div
        key={index}
        className={`color-circle ${selectedColor === color ? "selected" : ""}`}
        style={{ backgroundColor: color }}
        onClick={() => setSelectedColor(color)}
      ></div>
    ))}
  </div>
</div>

           {/* Two Cards Section */}
<div className="action-cards">
  <div className="action-card addtocart">
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
  <li><span class="feature-label">Features:</span> Pocketed</li>
<li><span class="feature-label">Thickness:</span> Normal</li>
<li><span class="feature-label">Body:</span> Not lined</li>
<li><span class="feature-label">Material composition:</span> 95% polyester, 5% spandex</li>
<li><span class="feature-label">Care instructions:</span> Machine wash cold. Tumble dry low.</li>
<li><span class="feature-label">Imported</span></li>

  </ul>
</div>
<Rating></Rating>
<Review></Review>
          </div>
        </div>
      </div>
<SimilarProduct></SimilarProduct>
<Footer></Footer>

    </div>
  );
}

export default SingleProduct;

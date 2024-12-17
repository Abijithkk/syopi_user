import React, { useState } from 'react';
import './Similarproduct.css';
import similar1 from '../images/similar1.jpeg';
import similar2 from '../images/similar2.jpeg';
import similar3 from '../images/similar3.jpeg';
import similar4 from '../images/similar4.jpeg';


function SimilarProduct() {
  const [wishlist, setWishlist] = useState({}); 

  const products = [
    { id: 1, image: similar1, title: 'Product 1', description: 'This is product 1' },
    { id: 2, image: similar2, title: 'Product 2', description: 'This is product 2' },
    { id: 3, image: similar3, title: 'Product 3', description: 'This is product 3' },
    { id: 4, image: similar4, title: 'Product 4', description: 'This is product 4' },
    { id: 5, image: 'image5.jpg', title: 'Product 5', description: 'This is product 5' },
    { id: 6, image: 'image6.jpg', title: 'Product 6', description: 'This is product 6' },
  ];

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id], 
    }));
  };

  return (
    <div className="similar-product">
      <p className="similarproductheading">Similar Products</p>
      <div className="similar-card-row">
        {products.map((product) => (
          <div className="similar-card" key={product.id}>
            <div className="similar-card-image-container">
              <img src={product.image} alt={product.title} className="similar-card-image" />
              <div
                className={`wishlist-icon ${wishlist[product.id] ? 'active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
              >
                <i className={wishlist[product.id] ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
              </div>
            </div>
            <p className="similar-card-title">{product.title}</p>
            <p className="similar-card-description">{product.description}</p>
          </div>
        ))}
      </div>
      <button className="product-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
          &#10094;
        </button>
        <button className="product-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
          &#10095;
        </button>
    </div>
  );
}

export default SimilarProduct;

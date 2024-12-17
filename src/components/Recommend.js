import React, { useState } from 'react';
import fp1 from '../images/fp1.jpeg';
import fp2 from '../images/fp2.jpeg';
import fp3 from '../images/fp3.jpeg';
import fp4 from '../images/fp4.jpeg';
import  './recommend.css'


function Recommend() {
  const [recommend, setRecommend] = useState({}); 

  const products = [
    { id: 1, image: fp1, title: 'Product 1', description: 'This is product 1' },
    { id: 2, image: fp2, title: 'Product 2', description: 'This is product 2' },
    { id: 3, image: fp3, title: 'Product 3', description: 'This is product 3' },
    { id: 4, image: fp4, title: 'Product 4', description: 'This is product 4' },
    { id: 5, image: 'image5.jpg', title: 'Product 5', description: 'This is product 5' },
    { id: 6, image: 'image6.jpg', title: 'Product 6', description: 'This is product 6' },
  ];

  const toggleWishlist = (id) => {
    setRecommend((prev) => ({
      ...prev,
      [id]: !prev[id], 
    }));
  };

  return (
    <div className="Recommend">
      <p className="Recommendheading">Recommended for you</p>
      <div className="Recommend-card-row">
        {products.map((product) => (
          <div className="Recommend-card" key={product.id}>
            <div className="Recommend-card-image-container">
              <img src={product.image} alt={product.title} className="Recommend-card-image" />
              <div
                className={`wishlist-icon ${recommend[product.id] ? 'active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
              >
                <i className={recommend[product.id] ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
              </div>
            </div>
            <p className="Recommend-card-title">{product.title}</p>
            <p className="Recommend-card-description">{product.description}</p>
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

export default Recommend;

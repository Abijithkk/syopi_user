import React, { useState } from 'react'
import Header from '../components/Header'
import similar1 from '../images/similar1.jpeg';
import similar2 from '../images/similar2.jpeg';
import similar3 from '../images/similar3.jpeg';
import similar4 from '../images/similar4.jpeg';
import './wishlist.css'

function Wishlist() {
    const [wishlist, setWishlist] = useState({}); 

    const products = [
      { id: 1, image: similar1, title: 'Product 1', description: 'This is product 1' },
      { id: 2, image: similar2, title: 'Product 2', description: 'This is product 2' },
      { id: 3, image: similar3, title: 'Product 3', description: 'This is product 3' },
      { id: 4, image: similar4, title: 'Product 4', description: 'This is product 4' },
    
    ];
  
    const toggleWishlist = (id) => {
      setWishlist((prev) => ({
        ...prev,
        [id]: !prev[id], 
      }));
    };
  
  return (
    <div>
        <Header></Header>
        <div className="no-wishlist container">
  <div className="wishlist-icon2">
    <i class="fa-regular fa-heart"></i>
  </div>
  <p className="empty-wishlist">Your wishlist is empty.</p>
  <p className="empty-wishlist-des">
    You don’t have any products in the wishlist yet. You will find a lot
    of interesting products on our Shop page.
  </p>
  <button className='wishlist-button'><span className='wishlist-button-text'>Continue Shopping</span></button>
</div>

        <div className="wishlist">
      <p className="wishlist-heading">My Wishlist <span className='wishlist-heading-span'>( 2 items )</span></p>
      <div className="wishlist-card-row">
        {products.map((product) => (
          <div className="wishlist-card" key={product.id}>
            <div className="wishlist-card-image-container">
              <img src={product.image} alt={product.title} className="wishlist-card-image" />
              <div
                className={`wishlist-icon ${wishlist[product.id] ? 'active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
              >
                <i className={wishlist[product.id] ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
              </div>
            </div>
            <p className="wishlist-card-title">{product.title}</p>
            <p className="wishlist-card-description">{product.description}</p>
          </div>
        ))}
      </div>
      
    </div>

        
    </div>
  )
}

export default Wishlist
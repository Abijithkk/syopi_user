import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './FBrand.css';
import fb1 from '../images/Fbrand1.jpeg';
import fb2 from '../images/Fbrand2.jpeg';
import fb3 from '../images/Fbrand3.jpeg';
import fb4 from '../images/Fbrand4.jpeg';

function Featuringbrands() {
  const [wishlist, setWishlist] = useState({});

  const products = [
    { id: 1, image: fb1, title: 'Product 1', description: 'This is product 1' },
    { id: 2, image: fb2, title: 'Product 2', description: 'This is product 2' },
    { id: 3, image: fb3, title: 'Product 3', description: 'This is product 3' },
    { id: 4, image: fb4, title: 'Product 4', description: 'This is product 4' },
    { id: 5, image: 'image5.jpg', title: 'Product 5', description: 'This is product 5' },
    { id: 6, image: 'image6.jpg', title: 'Product 6', description: 'This is product 6' },
  ];

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Framer motion animation variants
  const headingVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: index * 0.2, // Stagger animation for cards
      },
    }),
  };

  // Intersection Observer for heading and cards
  const { ref: headingRef, inView: headingInView } = useInView({
    threshold: 0.2,
  });

  const { ref: cardsRef, inView: cardsInView } = useInView({
    threshold: 0.2,
  });

  return (
    <div className="fbrand">
      {/* Animated Heading */}
      <motion.p
        ref={headingRef}
        className="fbrandheading"
        initial="hidden"
        animate={headingInView ? 'visible' : 'hidden'}
        variants={headingVariants}
      >
        Featuring Brands Now
      </motion.p>

      {/* Animated Cards */}
      <div className="feature-brand-card-row" ref={cardsRef}>
        {products.map((product, index) => (
          <motion.div
            className="feature-brand-card"
            key={product.id}
            custom={index}
            initial="hidden"
            animate={cardsInView ? 'visible' : 'hidden'}
            variants={cardVariants}
          >
            <div className="feature-card-brand-image-container">
              <img src={product.image} alt={product.title} className="feature-brand-card-image" />
              <div
                className={`brand-wishlist-icon ${wishlist[product.id] ? 'active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
              >
                <i className={wishlist[product.id] ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
              </div>
            </div>
            <p className="feature-brand-card-title">{product.title}</p>
            <p className="feature-brand-card-description">{product.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button className="product-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
        &#10094;
      </button>
      <button className="product-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
        &#10095;
      </button>
    </div>
  );
}

export default Featuringbrands;

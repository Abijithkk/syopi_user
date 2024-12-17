import './Topsales.css';
import Ts1 from '../images/Ts1.jpeg';
import Ts2 from '../images/Ts2.jpeg';
import Ts3 from '../images/Ts3.jpeg';
import Ts4 from '../images/Ts4.jpeg';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRef, useState, useEffect } from 'react';

function Topsales() {
  const products = [
    { id: 1, image: Ts1, title: 'Flash Sale' },
    { id: 2, image: Ts2, title: 'Flash Sale' },
    { id: 3, image: Ts3, title: 'Flash Sale' },
    { id: 4, image: Ts4, title: 'Flash Sale' },
    { id: 5, image: Ts3, title: 'Flash Sale' },
    { id: 6, image: Ts2, title: 'Flash Sale' },
  ];

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const containerRef = useRef(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);

  const checkScroll = () => {
    const container = containerRef.current;
    if (container) {
      const scrollLeft = Math.round(container.scrollLeft);
      const maxScrollLeft = Math.round(container.scrollWidth - container.clientWidth);
      setShowPrev(scrollLeft > 0);
      setShowNext(scrollLeft < maxScrollLeft);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll(); // Initialize button visibility
    }
    return () => container?.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollLeft = () => {
    containerRef.current.scrollBy({
      left: -300,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({
      left: 300,
      behavior: 'smooth',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="topsales"
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      exit="hidden"
    >
      <p className="topsalesheading1">Top Sales</p>
      <motion.div
        className="top-sales-card-row"
        variants={containerVariants}
        ref={containerRef}
        style={{
          overflowX: 'auto',
          display: 'flex',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
        }}
      >
        {products.map((product) => (
          <motion.div className="top-sales-card" key={product.id} variants={cardVariants} layout>
            <div className="top-sales-card-image-container">
              <img src={product.image} alt={product.title} className="Top-sales-card-image" />
              <div className="card-text-overlay">
                <p className="topsalesheading">{product.title}</p>
                <p className="topsalessubheading">Men's Outfit</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      {showPrev && (
        <button
          className="product-prev"
          type="button"
          onClick={scrollLeft}
          aria-label="Scroll Left"
        >
          &#10094;
        </button>
      )}
      {showNext && (
        <button
          className="product-next"
          type="button"
          onClick={scrollRight}
          aria-label="Scroll Right"
        >
          &#10095;
        </button>
      )}
    </motion.div>
  );
}

export default Topsales;

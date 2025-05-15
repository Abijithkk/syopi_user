import './Topsales.css';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRef, useState, useEffect } from 'react';
import { BASE_URL } from '../services/baseUrl';

function Topsales({products}) {
console.log("top-sales",products);



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
              <img src={`${BASE_URL}/uploads/${product.image}`} alt={product.title} className="Top-sales-card-image" />
              <div className="card-text-overlay">
                <p className="topsalesheading">{product.title}</p>
                <p className="topsalessubheading">{product.description}</p>
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

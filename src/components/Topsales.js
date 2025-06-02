import './Topsales.css';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from '../services/baseUrl';

function Topsales({products}) {

  const navigate = useNavigate();
  const location = useLocation();
  
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

  // Navigate with a unique key to force re-render of target component
  const navigateWithKey = (url) => {
    // Add a timestamp to force a reload
    const separator = url.includes('?') ? '&' : '?';
    const uniqueUrl = `${url}${separator}_k=${Date.now()}`;
    navigate(uniqueUrl);
  };

  // Handle top sales card click
  const handleTopSalesClick = (product) => {
    const params = new URLSearchParams(location.search);
    const currentSearch = params.get("search");
    
    // Build URL with category and subcategory filters
    let url = `/allproducts?category=${product.category}`;
    
    // Add subcategory if available
    if (product.subcategory) {
      url += `&subcategory=${product.subcategory}`;
    }
    
    // Preserve current search query if exists
    if (currentSearch) {
      url += `&search=${currentSearch}`;
    }
    
    navigateWithKey(url);
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
          <motion.div 
            className="top-sales-card" 
            key={product._id} 
            variants={cardVariants} 
            layout
            onClick={() => handleTopSalesClick(product)}
            style={{ cursor: 'pointer' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="top-sales-card-image-container">
              <img 
                src={`${BASE_URL}/uploads/${product.image}`} 
                alt={product.title} 
                className="Top-sales-card-image" 
              />
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
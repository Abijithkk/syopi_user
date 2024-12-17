import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './street.css';

function Street() {
  const { ref, inView } = useInView({
    threshold: 0.2, // Animation triggers when 20% of the component is in view
  });

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.4, // Delays button animation for better flow
      },
    },
  };

  return (
    <div ref={ref} className="streetwear">
      <motion.p
        className="street-heading"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={textVariants}
      >
        STREETWEAR FASHION
      </motion.p>
      <motion.p
        className="street-sub-heading"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={textVariants}
        transition={{ delay: 0.2 }} // Delays sub-heading slightly
      >
        ELEVATE YOUR WARDROBE WITH OUR COLLECTION
      </motion.p>
      <motion.button
        className="street-button"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={buttonVariants}
      >
        <span className="buttonfont">shop now</span>
      </motion.button>
    </div>
  );
}

export default Street;

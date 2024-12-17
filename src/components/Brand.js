import React from 'react';
import './Brand.css';
import Brandimg from '../images/Brand.png'

function Brand() {
  return (
    <div className="brand-container">
      <div className="brand-content">
        <div className="brand-image">
          <img src={Brandimg} alt="Brand" />
        </div>
        <div className="brand-text">
          <p className="subheading">Worlds leading fashion brand, Now in India</p>
          <p className="brand-name">ZARA</p>
          <p className="offer">Min.15% OFF</p>
        </div>
      </div>
    </div>
  );
}

export default Brand;

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home1.css';
import { BASE_URL } from '../services/baseUrl';

function Home1({ productSlider }) {
  return (
    <div className="home-carousel-container">
      <div id="homeCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="2000">
        <div className="carousel-indicators">
          {productSlider.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#homeCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? 'active' : ''}
              aria-current={index === 0 ? 'true' : undefined}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        <div className="carousel-inner">
          {productSlider.map((item, index) => (
            <div key={item._id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <img
                src={`${BASE_URL}/uploads/${item.image}`}
                className="d-block w-100"
                alt={item.title}
              />
            </div>
          ))}
        </div>

        <button className="prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
          &#10094;
        </button>
        <button className="next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
          &#10095;
        </button>
      </div>
    </div>
  );
}

export default Home1;

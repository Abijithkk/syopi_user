import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home1.css';
import c1 from '../images/Carousel1.jpeg';
import c2 from '../images/Carousel2.jpeg';
import c3 from '../images/Carousel3.jpeg';

function Home1() {
  return (
    <div className="home-carousel-container">
      <div id="homeCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="2000">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>

        {/* Carousel Items */}
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={c2} className="d-block w-100 " alt="Slide 1" />
          </div>
          <div className="carousel-item">
            <img src={c1} className="d-block w-100" alt="Slide 2" />
          </div>
          <div className="carousel-item">
            <img src={c3} className="d-block w-100" alt="Slide 3" />
          </div>
        </div>

        {/* Custom Controls */}
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

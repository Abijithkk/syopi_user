import React, { useState } from "react";
import "./filter.css";
import f1 from '../images/four-squares-10585.png'
import f2 from '../images/salefilter.png'
const categories = [
  { label: "All", imgSrc: f1 },
  { label: "Sale", imgSrc: f2 },
  { label: "Men", imgSrc: "https://via.placeholder.com/50" },
  { label: "Women", imgSrc: "https://via.placeholder.com/50" },
  { label: "Kids", imgSrc: "https://via.placeholder.com/50" },
  { label: "Accessories", imgSrc: "https://via.placeholder.com/50" },
];

function Filter() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="filter-container">
      <div className="scrolling-content">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`filter-item ${selectedCategory === category.label ? "active" : ""}`}
            onClick={() => setSelectedCategory(category.label)}
          >
            <img src={category.imgSrc} alt={category.label} className="filter-img" />
            <span className="filter-label">{category.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Filter;

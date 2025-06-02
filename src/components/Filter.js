import React, { useCallback, useEffect, useState } from "react";
import "./filter.css";
import { getCategoriesApi } from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";



function Filter() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCategoriesApi();
      
      if (response.data) {
        setCategories(response.data.categories);
        if (response.data.categories.length > 0) {
          setSelectedCategory(response.data.categories[0]._id);
        }
      } else {
        throw new Error("Invalid data format received.");
      }
    } catch (err) {
      setError(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);
    useEffect(() => {
      fetchCategories();
    }, [fetchCategories]);
  return (
    <div className="filter-container">
      <div className="scrolling-content">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`filter-item ${selectedCategory === category.label ? "active" : ""}`}
            onClick={() => setSelectedCategory(category.label)}
          >
            <img  src={`${BASE_URL}/uploads/${category.image}`} alt={category.name} className="filter-img" />
            <span className="filter-label2">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Filter;

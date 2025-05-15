import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./category.css";
import C1 from "../images/C1.jpeg";
import C2 from "../images/C2.jpeg";
import C3 from "../images/C3.jpeg";
import C4 from "../images/C4.jpeg";
import C5 from "../images/C5.jpeg";
import C6 from "../images/C6.jpeg";
import C7 from "../images/C7.jpeg";
import C8 from "../images/C8.jpeg";
import C9 from "../images/C9.jpeg";
import C10 from "../images/C10.jpeg";
import C11 from "../images/C11.jpeg";
import C12 from "../images/C12.jpeg";
import {
  getCategoriesApi,
  getSubcategoriesByCategoryIdApi,
} from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";

function Category() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCategoriesApi();
      
      if (response.data) {
        setCategories(response.data.categories);
        // Select the first category by default if available
        if (response.data.categories.length > 0) {
          setSelectedCategory(response.data.categories[0]._id);
          fetchSubcategories(response.data.categories[0]._id);
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

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) return;
    
    try {
      setSubLoading(true);
      const response = await getSubcategoriesByCategoryIdApi(categoryId);
      
      if (response.data) {
        setSubcategories(response.data.subCategories || []);
      } else {
        throw new Error("Invalid subcategory data format received.");
      }
    } catch (err) {
      console.error("Failed to load subcategories:", err);
    } finally {
      setSubLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchSubcategories(categoryId);
  };

  // Handle subcategory click to navigate to products page
  const handleSubcategoryClick = (subcategoryId) => {
    // Navigate to the all products page with subcategory as a query parameter
    navigate(`/allproducts?subcategory=${subcategoryId}`);
  };

  // Default card data as fallback
  const defaultCardData = [
    { title: "Makeup Set", image: C1 },
    { title: "T Shirts", image: C2 },
    { title: "Jeans", image: C3 },
    { title: "Casual Shirts", image: C4 },
    { title: "Sneaker", image: C5 },
    { title: "Sarees", image: C6 },
    { title: "Flipflops", image: C7 },
    { title: "Jewellery", image: C8 },
    { title: "Hand Bags", image: C9 },
    { title: "Socks", image: C10 },
    { title: "Trolley Bags", image: C11 },
    { title: "Caps", image: C12 },
  ];

  return (
    <div>
      <div>
        <p className="category-heading">Category</p>
        <div className="category-container">
          <div className="category-left">
            {loading ? (
              <p>Loading categories...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <ul>
                {categories.map((category) => (
                  <li 
                    key={category._id} 
                    className={`category-item ${selectedCategory === category._id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    <span className="category-name">{category.name}</span>
                    <img
                      src={`${BASE_URL}/uploads/${category.image}`}
                      alt={category.name}
                      className="category-image"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="category-right">
            {subLoading ? (
              <div className="loading-container">Loading subcategories...</div>
            ) : subcategories.length > 0 ? (
              // Use the available subcategories, ensuring they maintain the grid layout
              subcategories.map((subcategory) => (
                <div 
                  className="category-card" 
                  key={subcategory._id}
                  onClick={() => handleSubcategoryClick(subcategory._id)}
                >
                  <img 
                    src={`${BASE_URL}/uploads/${subcategory.image}`} 
                    alt={subcategory.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = C1; // Default fallback image
                    }}
                  />
                  <h3>{subcategory.name}</h3>
                </div>
              ))
            ) : (
              // Fallback to default cards if no subcategories
              defaultCardData.map((card, index) => (
                <div className="category-card" key={index}>
                  <img src={card.image} alt={card.title} />
                  <h3>{card.title}</h3>
                </div>
              ))
            )}
            {/* Add empty divs to maintain grid layout when there are fewer items */}
            {subcategories.length > 0 && subcategories.length < 4 && 
              Array(4 - subcategories.length).fill().map((_, index) => (
                <div key={`empty-${index}`} className="empty-card"></div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;
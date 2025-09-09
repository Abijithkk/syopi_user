import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./category.css";
import {
  getCategoriesApi,
  getSubcategoriesByCategoryIdApi,
} from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";

function Category() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
        
        // Check if there's a categoryId in URL parameters
        const categoryIdFromUrl = searchParams.get('categoryId');
        
        if (categoryIdFromUrl) {
          // Use the category ID from URL
          setSelectedCategory(categoryIdFromUrl);
          fetchSubcategories(categoryIdFromUrl);
        } else if (response.data.categories.length > 0) {
          // Default to first category if no URL parameter
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
  }, [searchParams]);

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
      setSubcategories([]); 
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
    // Update URL parameter when category is selected
    navigate(`/category?categoryId=${categoryId}`, { replace: true });
  };

  const handleSubcategoryClick = (subcategoryId) => {
    navigate(`/allproducts?subcategory=${subcategoryId}`);
  };

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
                   
                    <img
                      src={`${BASE_URL}/uploads/${category.image}`}
                      alt={category.name}
                      className="category-image"
                    />
                     <span className="category-name mt-2">{category.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="category-right">
            {subLoading ? (
              <div className="loading-container">Loading subcategories...</div>
            ) : subcategories.length > 0 ? (
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
                      e.target.style.display = 'none';
                    }}
                  />
                  <h3>{subcategory.name}</h3>
                </div>
              ))
            ) : (
              <div className="no-subcategories">
                <p>No subcategories available for this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;
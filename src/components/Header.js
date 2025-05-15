import React, { useContext, useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";
import { Navbar, Nav, FormControl } from "react-bootstrap";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import headerlogo from "../images/Headerlogo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "./SearchContext";
import { getCategoriesApi, getSubcategoriesByCategoryIdApi } from "../services/allApi";

function Header() {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const [inputValue, setInputValue] = useState(searchQuery || "");
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    brand: [],
    productType: "",
    minPrice: "",
    maxPrice: "",
    size: [],
    newArrivals: false,
    minRating: "",
    maxRating: "",
  });
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerElement = document.querySelector('.header');
      if (headerElement) {
        const headerHeight = headerElement.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      }
    };
    
    // Initial measurement
    updateHeaderHeight();
    
    // Re-measure on window resize
    window.addEventListener('resize', updateHeaderHeight);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch subcategories when hovering over a category
  useEffect(() => {
    if (hoveredCategory) {
      fetchSubcategories(hoveredCategory._id);
    }
  }, [hoveredCategory]);

  useEffect(() => {
    setInputValue(searchQuery || "");
  }, [searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    
    // Parse URL params to sync with current filters
    if (search && search !== searchQuery) {
      setSearchQuery(search);
    }
    
    // Sync other filter params from URL
    const categoryId = params.get("category");
    const subcategoryId = params.get("subcategory");
    const brand = params.get("brand");
    const productType = params.get("productType");
    const minPrice = params.get("minPrice");
    const maxPrice = params.get("maxPrice");
    const size = params.get("size");
    const newArrivals = params.get("newArrivals");
    const minRating = params.get("minRating");
    const maxRating = params.get("maxRating");
    
    // Update the advanced filters state based on URL params
    setAdvancedFilters(prev => ({
      ...prev,
      brand: brand ? brand.split(",") : [],
      productType: productType || "",
      minPrice: minPrice || "",
      maxPrice: maxPrice || "",
      size: size ? size.split(",") : [],
      newArrivals: newArrivals === "true",
      minRating: minRating || "",
      maxRating: maxRating || "",
    }));
    
  }, [location.search, searchQuery, setSearchQuery]);

  // Function to fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();
      if (response.status === 200) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Function to fetch subcategories by category ID
  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await getSubcategoriesByCategoryIdApi(categoryId);
      if (response.status === 200) {
        setSubcategories(response.data.subCategories || []);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Build URL with all relevant filters
  const buildFilterUrl = (baseQuery = "") => {
    const params = new URLSearchParams();
    
    // Add search query if available
    if (baseQuery) {
      params.append("search", baseQuery);
    }
    
    // Add all active filters from advancedFilters state
    const { brand, productType, minPrice, maxPrice, size, newArrivals, minRating, maxRating } = advancedFilters;
    
    if (brand.length > 0) params.append("brand", brand.join(","));
    if (productType) params.append("productType", productType);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (size.length > 0) params.append("size", size.join(","));
    if (newArrivals) params.append("newArrivals", "true");
    if (minRating) params.append("minRating", minRating);
    if (maxRating) params.append("maxRating", maxRating);
    
    return `/allproducts?${params.toString()}`;
  };

  // Trigger search with all active filters
  const triggerSearch = () => {
    const query = inputValue.trim();
    if (query) {
      setSearchQuery(query);
      navigateWithKey(buildFilterUrl(query));
    } else {
      // If search is empty but there are other filters, navigate with those
      if (Object.values(advancedFilters).some(val => 
        (Array.isArray(val) && val.length > 0) || 
        (typeof val === 'boolean' && val) || 
        (typeof val === 'string' && val)
      )) {
        navigateWithKey(buildFilterUrl());
      } else {
        // If no filters, navigate to all products
        navigateWithKey('/allproducts');
      }
    }
  };

  // Navigate with a unique key to force re-render of target component
  const navigateWithKey = (url) => {
    // Add a timestamp or random value to force a reload
    const separator = url.includes('?') ? '&' : '?';
    const uniqueUrl = `${url}${separator}_k=${Date.now()}`;
    navigate(uniqueUrl);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      triggerSearch();
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle category hover
  const handleCategoryHover = (category) => {
    setHoveredCategory(category);
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    // Keep any existing search query when changing category
    const params = new URLSearchParams(location.search);
    const currentSearch = params.get("search");
    const url = `/allproducts?category=${category._id}${currentSearch ? `&search=${currentSearch}` : ''}`;
    
    navigateWithKey(url);
    setIsDropdownOpen(false);
  };

  // Handle subcategory click
  const handleSubcategoryClick = (subcategory) => {
    // Keep any existing search query when changing subcategory
    const params = new URLSearchParams(location.search);
    const currentSearch = params.get("search");
    const url = `/allproducts?category=${hoveredCategory._id}&subcategory=${subcategory._id}${
      currentSearch ? `&search=${currentSearch}` : ''
    }`;
    
    navigateWithKey(url);
    setIsDropdownOpen(false);
  };

  // Handle all products click
  // const handleAllProductsClick = () => {
  //   // Keep any existing search query when viewing all products
  //   const params = new URLSearchParams(location.search);
  //   const currentSearch = params.get("search");
  //   navigateWithKey(currentSearch ? `/allproducts?search=${currentSearch}` : '/allproducts');
  //   setIsDropdownOpen(false);
  // };

  // Handle mouse leave for main dropdown
  const handleDropdownMouseLeave = () => {
    // Only clear hovered category if we're not hovering a subcategory
    if (!document.querySelector('.subcategories-dropdown:hover')) {
      setHoveredCategory(null);
    }
  };

  // Function to handle predefined searches
  const handlePredefinedSearch = (queryOrFilter) => {
    if (typeof queryOrFilter === 'string') {
      // If it's a simple string search
      setInputValue(queryOrFilter);
      setSearchQuery(queryOrFilter);
      navigateWithKey(`/allproducts?search=${encodeURIComponent(queryOrFilter)}`);
    } else if (typeof queryOrFilter === 'object') {
      // If it's a filter object (e.g., for sales, new arrivals, etc.)
      const params = new URLSearchParams();
      
      Object.entries(queryOrFilter).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, value.toString());
        }
      });
      
      navigateWithKey(`/allproducts?${params.toString()}`);
    }
  };

  // Function to handle quick filters
  const handleQuickFilter = (filterName) => {
    switch (filterName) {
      case 'sales':
        handlePredefinedSearch({ discountMin: 10 });
        break;
      case 'newArrivals':
        handlePredefinedSearch({ newArrivals: true });
        break;
      case 'topRated':
        handlePredefinedSearch({ minRating: 4.5 });
        break;
      case 'men':
        handlePredefinedSearch({ productType: 'men' });
        break;
      case 'women':
        handlePredefinedSearch({ productType: 'women' });
        break;
      case 'kids':
        handlePredefinedSearch({ productType: 'kids' });
        break;
      default:
        break;
    }
  };
  
  // Clear search
  const clearSearch = () => {
    setInputValue('');
    setSearchQuery('');
    // Focus back on search input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <Navbar expand="lg" className="p-3 header">
      <Navbar.Brand href="/" className="ms-2 header-brand">
        <img
          src={headerlogo}
          alt="Logo"
          className="logo"
          style={{ width: "50px", height: "50px" }}
        />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="navbar-nav" />

      <Navbar.Collapse id="navbar-nav" className="justify-content-end">
        <div className="d-flex align-items-center header2">
          <Nav className="me-3">
            <Nav.Link 
              className="px-3 headerlink" 
              onClick={() => handleQuickFilter('sales')}
            >
              Sale
            </Nav.Link>
            <Nav.Link 
              className="px-3 headerlink"
              onClick={() => handleQuickFilter('men')}
            >
              Men
            </Nav.Link>
            <Nav.Link 
              className="px-3 headerlink"
              onClick={() => handleQuickFilter('women')}
            >
              Women
            </Nav.Link>
            <Nav.Link 
              className="px-3 headerlink"
              onClick={() => handleQuickFilter('kids')}
            >
              Kids
            </Nav.Link>
            <Nav.Link 
              className="px-3 headerlink"
              onClick={() => handleQuickFilter('newArrivals')}
            >
              New Arrivals
            </Nav.Link>
          </Nav>

          <div 
            ref={dropdownRef}
            className={`header-dropdown me-3 position-relative ${isDropdownOpen ? 'open' : ''}`}
          >
            <div
              className="header-selected d-flex align-items-center"
              onClick={toggleDropdown}
            >
              <span>Categories</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                className="arrow ms-2"
                style={{ 
                  transform: isDropdownOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
              </svg>
            </div>
            
            {isDropdownOpen && (
              <div 
                className="categories-dropdown"
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="options">
                  {/* <div 
                    className="option"
                    onClick={handleAllProductsClick}
                  >
                    All Products
                  </div> */}
                  
                  {categories.map((category) => (
                    <div 
                      key={category._id} 
                      className={`category-item option ${hoveredCategory && hoveredCategory._id === category._id ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(category)} 
                      onMouseEnter={() => handleCategoryHover(category)}
                    >
                      <span>{category.name}</span>
                      {/* Arrow right icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 512 512"
                        className="arrow-right"
                      >
                        <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Separate subcategories dropdown for better positioning */}
            {isDropdownOpen && hoveredCategory && subcategories.length > 0 && (
              <div 
                className="subcategories-dropdown"
                style={{
                  position: 'absolute',
                  left: '100%',
                  top: `${categories.findIndex(c => c._id === hoveredCategory._id) * 40 + 40}px`,
                  zIndex: 1001
                }}
                onMouseEnter={() => setHoveredCategory(hoveredCategory)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="subcategories-title">
                  {hoveredCategory.name} - Subcategories
                </div>
                <div className="subcategories-list">
                  {subcategories.map((subcategory) => (
                    <div
                      key={subcategory._id}
                      className="subcategory-option"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubcategoryClick(subcategory);
                      }}
                    >
                      {subcategory.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="search-container me-3">
            <FaSearch className="search-icon" onClick={triggerSearch} />
            <FormControl
              ref={searchInputRef}
              type="search"
              placeholder="Search for products, brands etc."
              className="search-input"
              aria-label="Search"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            {inputValue && (
              <span className="clear-search" onClick={clearSearch}>
                ✕
              </span>
            )}
          </div>

          <div className="d-flex align-items-center header3">
            <Link to={"/profile"}>
              <div className="icon-wrapper me-4" title="Profile">
                <i className="fa-regular fa-user"></i>
              </div>
            </Link>
            <Link to={"/wishlist"}>
              <div className="icon-wrapper me-4" title="Wishlist">
                <i className="fa-regular fa-heart"></i>
              </div>
            </Link>
            <Link to={"/cart"}>
              <div className="icon-wrapper me-5" title="Cart">
                <FaShoppingCart size={20} />
              </div>
            </Link>
          </div>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
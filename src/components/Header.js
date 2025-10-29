import React, { useContext, useEffect, useState, useRef } from "react";
import "./Header.css";
import { Navbar, Nav, FormControl } from "react-bootstrap";
import { FaShoppingCart, FaSearch, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "./SearchContext";
import logo from '../../src/images/Headerlogo.png'
import { searchKeywordsApi } from "../services/allApi";

function Header() {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const [inputValue, setInputValue] = useState(searchQuery || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
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
    
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  useEffect(() => {
    setInputValue(searchQuery || "");
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch search suggestions
const fetchSuggestions = async (query) => {
  if (!query.trim()) {
    setSuggestions([]);
    setShowSuggestions(false);
    return;
  }

  setIsLoading(true);
  try {
    const response = await searchKeywordsApi(query);

    // ✅ Corrected path to keywords array
    const keywords = response?.data?.keywords;

    if (Array.isArray(keywords)) {
      const sortedSuggestions = keywords
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
      setSuggestions(sortedSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    setSuggestions([]);
    setShowSuggestions(false);
  } finally {
    setIsLoading(false);
  }
};


  // Debounced search for suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim()) {
        fetchSuggestions(inputValue);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const buildFilterUrl = (searchTerm = "") => {
    const currentParams = new URLSearchParams(location.search);
    const params = new URLSearchParams();
    
    // Add search query
    if (searchTerm) {
      params.append("keywords", searchTerm);
    } else if (currentParams.get("search")) {
      params.append("keywords", currentParams.get("keywords"));
    }
    
    // Preserve all existing filters
    const filterParams = [
      'brand', 'productType', 'minPrice', 'maxPrice', 'size', 
      'newArrivals', 'minRating', 'maxRating', 'discountMin', 
      'subcategory', 'category'
    ];
    
    filterParams.forEach(param => {
      const value = currentParams.get(param);
      if (value) params.append(param, value);
    });
    
    return `/allproducts?${params.toString()}`;
  };

  const handleSuggestionClick = (keyword) => {
    setInputValue(keyword);
    setSearchQuery(keyword);
    setShowSuggestions(false);
    navigateWithKey(buildFilterUrl(keyword));
  };

  const triggerSearch = () => {
    const query = inputValue.trim();
    if (query) {
      setSearchQuery(query);
      navigateWithKey(buildFilterUrl(query));
    } else {
      navigateWithKey(buildFilterUrl());
    }
    setShowSuggestions(false);
  };

  const navigateWithKey = (url) => {
    const separator = url.includes('?') ? '&' : '?';
    const uniqueUrl = `${url}${separator}_k=${Date.now()}`;
    navigate(uniqueUrl);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      triggerSearch();
    }
  };

  const clearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const getPopularityBadge = (count) => {
    if (count >= 10) return "popularity-high";
    if (count >= 5) return "popularity-medium";
    return "popularity-low";
  };

 

  return (
    <Navbar expand="lg" className="p-3 header">
      <Navbar.Brand href="/" className="ms-2 header-brand">
        <img
          src={logo}
          alt="Logo"
          className="logo"
          style={{ width: "50px", height: "50px" }}
        />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="navbar-nav" />

      <Navbar.Collapse id="navbar-nav" className="justify-content-end">
        <div className="d-flex align-items-center header2">
          <Nav className="me-3">
            <Link to="/" className="nav-link px-3 headerlink">
              Home
            </Link>
            <Link to="/category" className="nav-link px-3 headerlink">
              Categories
            </Link>
          </Nav>

          <div className="search-container me-3 position-relative">
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
              onFocus={() => inputValue.trim() && setShowSuggestions(true)}
            />
            
            {inputValue && (
              <FaTimes 
                className="clear-search-icon" 
                onClick={clearSearch}
              />
            )}

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div 
                ref={suggestionsRef}
                className="suggestions-dropdown"
              >
                {isLoading ? (
                  <div className="suggestion-item text-center">
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-2">Loading suggestions...</span>
                  </div>
                ) : suggestions.length > 0 ? (
                  <>
                    <div className="suggestions-header">
                      
                    </div>
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(item.keyword)}
                      >
                        <FaSearch className="suggestion-icon" />
                        <div className="suggestion-content">
                          <span className="suggestion-text">{item.keyword}</span>
                          <div className="suggestion-meta">
                           
                            
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : inputValue.trim() ? (
                  <div className="suggestion-item text-muted">
                    <FaSearch className="suggestion-icon" />
                    <span>No suggestions found for "{inputValue}"</span>
                  </div>
                ) : null}
                
                {inputValue.trim() && (
                  <div 
                    className="suggestion-item search-all-item"
                    onClick={triggerSearch}
                  >
                    <FaSearch className="suggestion-icon" />
                    <div className="suggestion-content">
                      <span className="suggestion-text">
                        Search for "<strong>{inputValue}</strong>"
                      </span>
                    </div>
                  </div>
                )}
              </div>
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
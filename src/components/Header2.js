import React, { useState, useContext, useRef, useCallback, useEffect } from 'react';
import './header2.css';
import { Form, FormControl, Row } from 'react-bootstrap';
import { MdNotifications, MdHome, MdShoppingCart, MdPerson } from 'react-icons/md';
import { IoMdHeart } from 'react-icons/io';
import { BiCategory } from 'react-icons/bi';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SearchContext } from './SearchContext';
import { searchKeywordsApi } from "../services/allApi";

function Header2() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationPaths = {
    home: '/',
    categories: '/category',
    cart: '/cart',
    account: '/profile'
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const activeTabFromPath = Object.entries(navigationPaths).find(
      ([_, path]) => currentPath === path || (path !== '/' && currentPath.startsWith(path))
    );
    
    if (activeTabFromPath) {
      setActiveTab(activeTabFromPath[0]);
    }
  }, [location.pathname]);

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
      const keywords = response?.data?.keywords;

      if (Array.isArray(keywords)) {
        const sortedSuggestions = keywords
          .sort((a, b) => b.count - a.count)
          .slice(0, 6); // Show fewer suggestions on mobile
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
      if (searchInputValue.trim()) {
        fetchSuggestions(searchInputValue);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInputValue]);

  const navigateWithKey = useCallback((url) => {
    try {
      const separator = url.includes('?') ? '&' : '?';
      const uniqueUrl = `${url}${separator}_k=${Date.now()}`;
      navigate(uniqueUrl);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigate]);

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

  const triggerSearch = useCallback(() => {
    const query = searchInputValue.trim();
    
    if (query) {
      try {
        setIsSearching(true);
        setSearchQuery(query);
        setShowSuggestions(false);
        navigateWithKey(buildFilterUrl(query));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }
  }, [searchInputValue, setSearchQuery, navigateWithKey]);

  const handleTabChange = useCallback((tab) => {
    try {
      setActiveTab(tab);
      const path = navigationPaths[tab];
      if (path) {
        navigate(path);
      }
    } catch (error) {
      console.error('Tab navigation error:', error);
    }
  }, [navigate]);

  const handleSearchInputChange = useCallback((e) => {
    setSearchInputValue(e.target.value);
  }, []);

  const handleSearchKeyPress = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      triggerSearch();
    }
  }, [triggerSearch]);

  const handleSearchIconClick = useCallback(() => {
    triggerSearch();
  }, [triggerSearch]);

  const handleSuggestionClick = useCallback((keyword) => {
    setSearchInputValue(keyword);
    setSearchQuery(keyword);
    setShowSuggestions(false);
    navigateWithKey(buildFilterUrl(keyword));
  }, [setSearchQuery, navigateWithKey]);

  const clearSearch = useCallback(() => {
    setSearchInputValue("");
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [setSearchQuery]);

  const handleInputFocus = useCallback(() => {
    if (searchInputValue.trim()) {
      setShowSuggestions(true);
    }
  }, [searchInputValue]);

  return (
    <>
      <div className='header-mobile'>
        <Row className="custom-header-section">
          <div className="custom-search-wrapper">
            <Form className="custom-search-form" onSubmit={(e) => e.preventDefault()}>
              <div className="mobile-search-container position-relative">
                <FaSearch
                  className={`mobile-search-icon ${isSearching ? 'searching' : ''}`}
                  onClick={handleSearchIconClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSearchIconClick();
                    }
                  }}
                  aria-label="Search products"
                />
                <FormControl
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search for products, brands etc."
                  className="custom-search-input"
                  aria-label="Search"
                  value={searchInputValue}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleSearchKeyPress}
                  onFocus={handleInputFocus}
                  disabled={isSearching}
                  autoComplete="off"
                />
                {searchInputValue && (
                  <FaTimes 
                    className="mobile-clear-search-icon" 
                    onClick={clearSearch}
                    role="button"
                    tabIndex={0}
                    aria-label="Clear search"
                  />
                )}

                {/* Search Suggestions Dropdown for Mobile */}
                {showSuggestions && (
                  <div 
                    ref={suggestionsRef}
                    className="mobile-suggestions-dropdown"
                  >
                    {isLoading ? (
                      <div className="mobile-suggestion-item text-center">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-2">Loading suggestions...</span>
                      </div>
                    ) : suggestions.length > 0 ? (
                      <>
                        {suggestions.map((item, index) => (
                          <div
                            key={index}
                            className="mobile-suggestion-item"
                            onClick={() => handleSuggestionClick(item.keyword)}
                          >
                            <FaSearch className="mobile-suggestion-icon" />
                            <div className="mobile-suggestion-content">
                              <span className="mobile-suggestion-text">{item.keyword}</span>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : searchInputValue.trim() ? (
                      <div className="mobile-suggestion-item text-muted">
                        <FaSearch className="mobile-suggestion-icon" />
                        <span>No suggestions found for "{searchInputValue}"</span>
                      </div>
                    ) : null}
                    
                    {searchInputValue.trim() && (
                      <div 
                        className="mobile-suggestion-item search-all-item"
                        onClick={triggerSearch}
                      >
                        <FaSearch className="mobile-suggestion-icon" />
                        <div className="mobile-suggestion-content">
                          <span className="mobile-suggestion-text">
                            Search for "<strong>{searchInputValue}</strong>"
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Form>
          </div>
          <div className="custom-icons-wrapper">
            <Link to={'/notifications'} className="mobile-icon-link">
              <MdNotifications 
                className="mobile-header-icon"
                role="button"
                tabIndex={0}
                aria-label="Notifications"
              />
            </Link>
            <Link to={'/wishlist'} className="mobile-icon-link">
              <IoMdHeart 
                className="mobile-header-icon"
                role="button"
                tabIndex={0}
                aria-label="Favorites"
              />
            </Link>
          </div>
        </Row>
      </div>

      <div className="bottom-navigation">
        <div
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => handleTabChange('home')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTabChange('home');
            }
          }}
          aria-label="Navigate to Home"
        >
          <MdHome className="nav-icon" />
          <span className="nav-text">Home</span>
        </div>
        <div
          className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => handleTabChange('categories')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTabChange('categories');
            }
          }}
          aria-label="Navigate to Categories"
        >
          <BiCategory className="nav-icon" />
          <span className="nav-text">Categories</span>
        </div>
        <div
          className={`nav-item ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => handleTabChange('cart')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTabChange('cart');
            }
          }}
          aria-label="Navigate to Cart"
        >
          <MdShoppingCart className="nav-icon" />
          <span className="nav-text">Cart</span>
        </div>
        <div
          className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => handleTabChange('account')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTabChange('account');
            }
          }}
          aria-label="Navigate to Account"
        >
          <MdPerson className="nav-icon" />
          <span className="nav-text">Account</span>
        </div>
      </div>
    </>
  );
}

export default Header2;
import React, { useState, useContext, useRef, useCallback, useEffect } from 'react';
import './header2.css';
import { Form, FormControl, Row } from 'react-bootstrap';
import { MdNotifications, MdHome, MdShoppingCart, MdPerson } from 'react-icons/md';
import { IoMdHeart } from 'react-icons/io';
import { BiCategory } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SearchContext } from './SearchContext';

function Header2() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { setSearchQuery } = useContext(SearchContext);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Define navigation paths for each tab
  const navigationPaths = {
    home: '/',
    categories: '/category',
    cart: '/cart',
    account: '/profile'
  };

  // Update active tab based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    const activeTabFromPath = Object.entries(navigationPaths).find(
      ([_, path]) => currentPath === path || (path !== '/' && currentPath.startsWith(path))
    );
    
    if (activeTabFromPath) {
      setActiveTab(activeTabFromPath[0]);
    }
  }, [location.pathname]);

  const navigateWithKey = useCallback((url) => {
    try {
      const separator = url.includes('?') ? '&' : '?';
      const uniqueUrl = `${url}${separator}_k=${Date.now()}`;
      navigate(uniqueUrl);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigate]);

  const triggerSearch = useCallback(() => {
    const query = searchInputValue.trim();
    
    if (query) {
      try {
        setIsSearching(true);
        setSearchQuery(query);
        navigateWithKey(`/allproducts?search=${encodeURIComponent(query)}`);
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

  return (
    <>
      <div className='header-mobile'>
        <Row className="custom-header-section">
          <div className="custom-search-wrapper">
            <Form className="custom-search-form" onSubmit={(e) => e.preventDefault()}>
              <div className="mobile-search-container">
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
                  disabled={isSearching}
                  autoComplete="off"
                />
              </div>
            </Form>
          </div>
          <div className="custom-icons-wrapper">
            <Link to={'/notifications'}>
              <MdNotifications 
                role="button"
                tabIndex={0}
                aria-label="Notifications"
              />
            </Link>
           <Link to={'/wishlist'}>
              <IoMdHeart 
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
import React, { useContext, useEffect, useState, useRef } from "react";
import "./Header.css";
import { Navbar, Nav, FormControl } from "react-bootstrap";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "./SearchContext";
import logo from '../../src/images/Headerlogo.png'

function Header() {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const [inputValue, setInputValue] = useState(searchQuery || "");
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
    
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  useEffect(() => {
    setInputValue(searchQuery || "");
  }, [searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    
    if (search && search !== searchQuery) {
      setSearchQuery(search);
    }
    
    const brand = params.get("brand");
    const productType = params.get("productType");
    const minPrice = params.get("minPrice");
    const maxPrice = params.get("maxPrice");
    const size = params.get("size");
    const newArrivals = params.get("newArrivals");
    const minRating = params.get("minRating");
    const maxRating = params.get("maxRating");
    
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

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Fixed buildFilterUrl to preserve existing URL parameters
const buildFilterUrl = (baseQuery = "") => {
  const currentParams = new URLSearchParams(location.search);
  const params = new URLSearchParams();
  
  // Add search query
  if (baseQuery) {
    params.append("search", baseQuery);
  } else if (currentParams.get("search")) {
    params.append("search", currentParams.get("search"));
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

  const triggerSearch = () => {
    const query = inputValue.trim();
    if (query) {
      setSearchQuery(query);
      navigateWithKey(buildFilterUrl(query));
    } else {
      // If no search query, preserve existing filters
      navigateWithKey(buildFilterUrl());
    }
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

  // Fixed handlePredefinedSearch to preserve existing filters
  const handlePredefinedSearch = (queryOrFilter) => {
    if (typeof queryOrFilter === 'string') {
      setInputValue(queryOrFilter);
      setSearchQuery(queryOrFilter);
      // Preserve existing filters when doing text search
      navigateWithKey(buildFilterUrl(queryOrFilter));
    } else if (typeof queryOrFilter === 'object') {
      // Start with current URL parameters
      const currentParams = new URLSearchParams(location.search);
      const params = new URLSearchParams();
      
      // Preserve existing parameters
      for (const [key, value] of currentParams.entries()) {
        if (key !== '_k') { // Skip timestamp parameter
          params.append(key, value);
        }
      }
      
      // Add or override with new filter values
      Object.entries(queryOrFilter).forEach(([key, value]) => {
        params.delete(key); // Remove existing value
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, value.toString());
        }
      });
      
      navigateWithKey(`/allproducts?${params.toString()}`);
    }
  };
  const handleNavigation = () => {
    navigate("/");
  };

  // const handleQuickFilter = (filterName) => {
  //   switch (filterName) {
  //     case 'sales':
  //       handlePredefinedSearch({ discountMin: 10 });
  //       break;
  //     case 'newArrivals':
  //       handlePredefinedSearch({ newArrivals: true });
  //       break;
  //     case 'topRated':
  //       handlePredefinedSearch({ minRating: 4.5 });
  //       break;
  //     case 'men':
  //       handlePredefinedSearch({ productType: 'men' });
  //       break;
  //     case 'women':
  //       handlePredefinedSearch({ productType: 'women' });
  //       break;
  //     case 'kids':
  //       handlePredefinedSearch({ productType: 'kids' });
  //       break;
  //     default:
  //       break;
  //   }
  // };
  
  // Clear search
  // const clearSearch = () => {
  //   setInputValue('');
  //   setSearchQuery('');
  //   if (searchInputRef.current) {
  //     searchInputRef.current.focus();
  //   }
  // };

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
          
           
            <Nav.Link 
              className="px-3 headerlink" 
              onClick={() => handleNavigation}
            >
              Home
            </Nav.Link>
 {/* 
            <Nav.Link 
              className="px-3 headerlink"
              onClick={() => handleQuickFilter('newArrivals')}
            >
              New Arrivals
            </Nav.Link> */}


            <Link to="/category" className="nav-link px-3 headerlink">
              Categories
            </Link>
          </Nav>

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
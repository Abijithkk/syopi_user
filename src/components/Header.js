import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";
import { Navbar, Nav, FormControl } from "react-bootstrap";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import headerlogo from "../images/Headerlogo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "./SearchContext";

function Header() {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const [inputValue, setInputValue] = useState(searchQuery || "");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [location.search, searchQuery, setSearchQuery]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Trigger search only on Enter or clicking the search icon
  const triggerSearch = () => {
    const query = inputValue.trim();
    if (query) {
      setSearchQuery(query);
      navigate(`/allproducts?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      triggerSearch();
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
            <Nav.Link href="#link1" className="px-3 headerlink">
              Sale
            </Nav.Link>
            <Nav.Link href="#link2" className="px-3 headerlink">
              Men
            </Nav.Link>
            <Nav.Link href="#link3" className="px-3 headerlink">
              Women
            </Nav.Link>
            <Nav.Link href="#link4" className="px-3 headerlink">
              Kids
            </Nav.Link>
          </Nav>

          <div className="header-dropdown me-3">
            <div
              className="header-selected"
              data-default="Categories"
              data-one="Option 1"
              data-two="Option 2"
              data-three="Option 3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                className="arrow"
              >
                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
              </svg>
            </div>
            <div className="options">
              <Link to="/category" className="unstyled-link">
                <div title="all">
                  <input id="all" name="option" type="radio" defaultChecked />
                  <label
                    className="option"
                    htmlFor="all"
                    data-txt="All"
                  ></label>
                </div>
              </Link>
              <Link to="/category" className="unstyled-link">
                <div title="option-1">
                  <input id="option-1" name="option" type="radio" />
                  <label
                    className="option"
                    htmlFor="option-1"
                    data-txt="Option 1"
                  ></label>
                </div>
              </Link>
              <Link to="/category" className="unstyled-link">
                <div title="option-2">
                  <input id="option-2" name="option" type="radio" />
                  <label
                    className="option"
                    htmlFor="option-2"
                    data-txt="Option 2"
                  ></label>
                </div>
              </Link>
              <Link to="/category" className="unstyled-link">
                <div title="option-3">
                  <input id="option-3" name="option" type="radio" />
                  <label
                    className="option"
                    htmlFor="option-3"
                    data-txt="Option 3"
                  ></label>
                </div>
              </Link>
            </div>
          </div>

          <div className="search-container me-3">
            <FaSearch className="search-icon" />
            <FormControl
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
            <Link to={"/addressdetails"}>
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

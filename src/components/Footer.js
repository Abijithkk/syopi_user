import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import f1 from '../images/f1.png';
import f2 from '../images/f2.png';
import { getCategoriesApi } from '../services/allApi';

function Footer() {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch categories when dropdown is opened for the first time
  const fetchCategories = async () => {
    if (categories.length === 0) {
      setLoading(true);
      try {
        const response = await getCategoriesApi();
        
        
        setCategories(response.data.categories || response || []); // Handle different response structures
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      fetchCategories();
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <footer className="footer">
      <Container className="footer-container">
        {/* First Row */}
        <Row>
          <Col xs={12} sm={6} md={3} className="footer-column">
            <p className="footer-heading">Need Help</p>
            <ul>
              <li>Contact Us</li>
              <li>Track Order</li>
              <li>Returns & Refunds</li>
              <li>FAQ's</li>
              <li>Career</li>
            </ul>
          </Col>
          <Col xs={12} sm={6} md={3} className="footer-column">
            <p className="footer-heading">Company</p>
            <ul>
              <li>About Us</li>
              <li>euphoria Blog</li>
              <li>euphoriastan</li>
              <li>Collaboration</li>
              <li>Media</li>
            </ul>
          </Col>
          <Col xs={12} sm={6} md={3} className="footer-column">
            <p className="footer-heading">More Info</p>
            <ul>
              <li>Terms and Conditions</li>
              <li>Privacy Policy</li>
              <li>Shipping Policy</li>
              <li>Sitemap</li>
            </ul>
          </Col>
          <Col xs={12} sm={6} md={3} className="footer-column">
            <p className="footer-heading">Location</p>
            <ul>
              <li>support@euphoria.in</li>
              <li>Eklingpura Chouraha, Ahmedabad Main Road</li>
              <li>(NH 8- Near Mahadev Hotel) Udaipur, India- 313002</li>
            </ul>
          </Col>
        </Row>

        {/* Second Row */}
        <Row className="align-items-center second-row">
          <Col xs={12} md={6} className="icon-column">
            <div className="icon-containers">
              <div className="icon-boxs">
                <FaFacebook className="social-icons" />
              </div>
              <div className="icon-boxs">
                <FaTwitter className="social-icons" />
              </div>
              <div className="icon-boxs">
                <FaInstagram className="social-icons" />
              </div>
              <div className="icon-boxs">
                <FaLinkedin className="social-icons" />
              </div>
            </div>
          </Col>
          <Col xs={12} md={6} className="download-column">
            <p className="download-app">Download The App</p>
            <div className="app-links">
              <div className="playstore">
                <img style={{ width: '25px', height: '25px' }} src={f1} alt="" />
                <div>
                  <p className="g1">android app on</p>
                  <p className="g2">Google Play</p>
                </div>
              </div>
              <div className="appstore">
                <img style={{ width: '25px', height: '25px' }} src={f2} alt="" />
                <div>
                  <p className="a1">Available on the</p>
                  <p className="a2">App Store</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <hr />
        
        {/* Category Section with Dropdown */}
        <Row>
          <Col xs={12} className="footer-category-section">
            <div className="footer-category-header" onClick={toggleDropdown}>
              <p className='f-text'>Popular Categories</p>
              <div className="footer-dropdown-icon">
                {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
            
            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div className="footer-category-dropdown">
                {loading ? (
                  <div className="footer-loading-text">Loading categories...</div>
                ) : (
                  <ul className="footer-category-list">
                    {categories.length > 0 ? (
                      categories.map((category, index) => (
                        <li key={index} className="footer-category-item">
                          {category.name || category.title || category}
                        </li>
                      ))
                    ) : (
                      <li className="footer-no-categories">No categories available</li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </Col>
        </Row>
        
        <hr />
      </Container>
    </footer>
  );
}

export default Footer;
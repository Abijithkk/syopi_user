import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import f1 from '../images/f1.png';
import f2 from '../images/f2.png';
import { getCategoriesApi } from '../services/allApi';
import { Link } from 'react-router-dom';

function Footer() {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
              <Link style={{textDecoration:'none',color:'#F6F6F6'}} to={'/order'}><li>Track Order</li></Link>
              <Link style={{textDecoration:'none',color:'#F6F6F6'}} to={'/order'}><li>Returns & Refunds</li></Link>
             
            </ul>
          </Col>
          <Col xs={12} sm={6} md={3} className="footer-column">
            <p className="footer-heading">Company</p>
            <ul>
              <li>About Us</li>
              
            </ul>
          </Col>
          <Col xs={12} sm={6} md={3} className="footer-column">
            <p className="footer-heading">More Info</p>
            <ul>
              <Link style={{textDecoration:'none',color:'#F6F6F6'}} to={'/returnpolicy'}><li>Return & Refund Policy</li></Link>
              <Link style={{textDecoration:'none',color:'#F6F6F6'}} to={'/privacypolicy'}><li>Privacy policy</li></Link>
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
             <Link style={{textDecoration:'none'}} to={'https://play.google.com/store/apps/details?id=com.syopi.usernew&pcampaignid=web_share'}>
                <div className="playstore">
                  <img style={{ width: '25px', height: '25px' }} src={f1} alt="" />
                  <div>
                    <p className="g1">android app on</p>
                    <p className="g2">Google Play</p>
                  </div>
                </div>
             </Link>
              <Link style={{textDecoration:'none'}} to={'http://apps.apple.com/in/app/syopi/id6747420245'}>
              <div className="appstore">
                <img style={{ width: '25px', height: '25px' }} src={f2} alt="" />
                <div>
                  <p className="a1">Available on the</p>
                  <p className="a2">App Store</p>
                </div>
              </div>
              </Link>
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
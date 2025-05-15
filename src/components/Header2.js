import React, { useState, useEffect } from 'react';
import './header2.css';
import { Col, Form, FormControl, Row } from 'react-bootstrap';
import { CiLocationOn } from 'react-icons/ci';
import { AiOutlineDown } from 'react-icons/ai';
import { MdNotifications, MdHome, MdShoppingCart, MdPerson } from 'react-icons/md';
import { IoMdHeart } from 'react-icons/io';
import { BiCategory } from 'react-icons/bi';

function Header2() {
  const [isLocationSearch, setIsLocationSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  const handleLocationClick = () => {
    setIsLocationSearch(true);
  };
  
  const handleUseCurrentLocation = () => {
    // Logic to fetch the current location (if needed)
    setIsLocationSearch(false);
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <>
      <div className='header-mobile'>
        {!isLocationSearch ? (
          <div className="header-location-section" onClick={handleLocationClick}>
            <Row>
              <Col className="location-text-col">
                <div className="location-top">
                  <p className="header-location">Location</p>
                </div>
                <div className="location-bottom">
                  <CiLocationOn style={{ color: '#00A8FF', marginRight: '8px', marginTop: '-8px' }} />
                  <p className="header-location2">Pattambi</p>
                  <AiOutlineDown className="dropdown-iconss" />
                </div>
              </Col>
            </Row>
          </div>
        ) : (
          <div className="header-location-search">
            <Row>
              <Col>
                <div className="location-search-form">
                  <Form className="location-search-form">
                    <FormControl
                      type="search"
                      placeholder="Search for City, area etc..."
                      className="location-search-input"
                      aria-label="Search"
                    />
                  </Form>
                </div>
                <div className="current-location-wrapper">
                  <CiLocationOn style={{ color: '#00A8FF', marginRight: '8px' }} />
                  <p className="use-current-location" onClick={handleUseCurrentLocation}>
                    Use Current Location
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        )}
        
        <Row className="custom-header-section">
          <div className="custom-search-wrapper">
            <Form className="custom-search-form">
              <FormControl
                type="search"
                placeholder="Search"
                className="custom-search-input"
                aria-label="Search"
              />
            </Form>
          </div>
          <div className="custom-icons-wrapper">
            <MdNotifications />
            <IoMdHeart />
          </div>
        </Row>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bottom-navigation">
        <div 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => handleTabChange('home')}
        >
          <MdHome className="nav-icon" />
          <span className="nav-text">Home</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => handleTabChange('categories')}
        >
          <BiCategory className="nav-icon" />
          <span className="nav-text">Categories</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => handleTabChange('cart')}
        >
          <MdShoppingCart className="nav-icon" />
          <span className="nav-text">Cart</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => handleTabChange('account')}
        >
          <MdPerson className="nav-icon" />
          <span className="nav-text">Account</span>
        </div>
      </div>
    </>
  );
}

export default Header2;
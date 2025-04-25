import React, { useState } from 'react';
import './header2.css';
import { Col, Form, FormControl, Row } from 'react-bootstrap';
import { CiLocationOn } from 'react-icons/ci';
import { AiOutlineDown } from 'react-icons/ai';
import { MdNotifications } from 'react-icons/md';
import { IoMdHeart } from 'react-icons/io';

function Header2() {
  const [isLocationSearch, setIsLocationSearch] = useState(false);

  const handleLocationClick = () => {
    setIsLocationSearch(true);
  };

  const handleUseCurrentLocation = () => {
    // Logic to fetch the current location (if needed)
    setIsLocationSearch(false);
  };

  return (
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
  );
}

export default Header2;

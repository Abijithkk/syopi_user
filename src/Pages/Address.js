import React from 'react'
import './address.css'
import { Container, Row, Col, Card } from 'react-bootstrap';
import Header from '../components/Header';

function Address() {
  return (
    <div>
        <Header></Header>
         <Container fluid className="address-container my-5">
        <Row className="no-gutters">
          {/* Left Column */}
          <Col xs={12} md={7} className="address-left-column mb-4 mb-md-0">
            {/* First Card */}
            <Card className="address-item mb-4">
              <Row className="align-items-center">
                
                <Col xs={12} sm={8}>
                  <Card.Body className="p-0">
                  <Row className="align-items-center">
    <Col  xs="auto">
        <input 
            type="checkbox" 
            className="custom-checkbox" 
            id="checkbox-alex" 
        />
    </Col>
    <Col>
        <Card.Title className="address-title">
            Alex Johnson
        </Card.Title>
    </Col>
</Row>

                    <Card.Text>
                      <p className="color-size">Building 42, Apartment 3B, Greenview Complex 
                      Oakwood City, CA 90210</p>
                      <p className="color-size">Phone Number : (555) 123-4567</p>
                      
                    </Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>

            {/* Additional Card */}
      
      <button className="w-100 add-shipping-button"><i class="fa fa-plus-circle me-3 fs-5"></i>Add New Shipping Address</button>
          </Col>

          {/* Right Column */}
          <Col xs={12} md={5} className="address-right-column">
            <Card className="address-checkout p-3 shadow">
              <Card.Body>
                <div className="address-points-info text-center bg-light p-3">
                  <p className="m-0 address-points">
                    1 Point = 1 Rupee: For example, if you have 40 points, you
                    can use them as 40 rupees on your purchase.
                  </p>
                  <button className="checkout-button1 mt-2">
                    Claim with Syopi points
                  </button>
                </div>
                <Card.Text className="mt-3">
                  <div className="d-flex justify-content-between">
                    <p className="address-check-total">Total Items:</p>
                    <p className="text-end address-check-total">6</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="address-check-total">Total MRP:</p>
                    <p className="text-end address-check-total">$149.95</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="address-check-total">Total Discount:</p>
                    <p className="text-end points">$10.00</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="address-check-total">Syopi Points:</p>
                    <p className="text-end points">$5.00</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="address-check-total">Total Price:</p>
                    <p className="text-end address-console.log('Address component rendered');heck-total">$134.95</p>
                  </div>
                </Card.Text>
                <button className="w-100 mb-2 checkout-button">Continue</button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Address
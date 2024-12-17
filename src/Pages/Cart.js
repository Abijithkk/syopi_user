import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Cart.css';
import C1 from '../images/Cart1.jpeg';
import C2 from '../images/Cart2.jpeg';
import Header from '../components/Header';
import Recommend from '../components/Recommend';

function Cart() {
  return (
    <div>
      <Header />
      <Container fluid className="cart-container my-5">
        <Row className="no-gutters">
          {/* Left Column */}
          <Col xs={12} md={7} className="cart-left-column mb-4 mb-md-0">
            {/* First Card */}
            <Card className="cart-item mb-4">
              <Row className="align-items-center">
                <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                  <img src={C1} alt="Product" className="cart-image img-fluid" />
                </Col>
                <Col xs={12} sm={8}>
                  <Card.Body className="p-0">
                    <Card.Title className="cart-title">
                      Color Block Long Sleeve Jacket
                    </Card.Title>
                    <Card.Text>
                      <p className="color-size">Color: Yellow</p>
                      <p className="color-size">Size: M</p>
                      <div className="cart-quantity">
                        <div className="quantity-wrapper">
                          <button className="quantity-btn minus">-</button>
                          <span className="quantity-number">2</span>
                          <button className="quantity-btn plus">+</button>
                        </div>
                      </div>
                      <p className="cart-delivery">Delivery: Free Delivery</p>
                    </Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>

            {/* Additional Card */}
            <Card className="cart-item mb-4">
              <Row className="align-items-center">
                <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                  <img src={C2} alt="Product" className="cart-image img-fluid" />
                </Col>
                <Col xs={12} sm={8}>
                  <Card.Body className="p-0">
                    <Card.Title className="cart-title">
                      Color Block Long Sleeve Jacket
                    </Card.Title>
                    <Card.Text>
                      <p className="color-size">Color: Yellow</p>
                      <p className="color-size">Size: M</p>
                      <div className="cart-quantity">
                        <div className="quantity-wrapper">
                          <button className="quantity-btn minus">-</button>
                          <span className="quantity-number">2</span>
                          <button className="quantity-btn plus">+</button>
                        </div>
                      </div>
                      <p className="cart-delivery">Delivery: Free Delivery</p>
                    </Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column */}
          <Col xs={12} md={5} className="cart-right-column">
            <Card className="cart-checkout p-3 shadow">
              <Card.Body>
                <div className="cart-points-info text-center bg-light p-3">
                  <p className="m-0 cart-points">
                    1 Point = 1 Rupee: For example, if you have 40 points, you
                    can use them as 40 rupees on your purchase.
                  </p>
                  <button className="checkout-button1 mt-2">
                    Claim with Syopi points
                  </button>
                </div>
                <Card.Text className="mt-3">
                  <div className="d-flex justify-content-between">
                    <p className="cart-check-total">Total Items:</p>
                    <p className="text-end cart-check-total">6</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="cart-check-total">Total MRP:</p>
                    <p className="text-end cart-check-total">$149.95</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="cart-check-total">Total Discount:</p>
                    <p className="text-end points">$10.00</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="cart-check-total">Syopi Points:</p>
                    <p className="text-end points">$5.00</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="cart-check-total">Total Price:</p>
                    <p className="text-end cart-check-total">$134.95</p>
                  </div>
                </Card.Text>
                <button className="w-100 mb-2 checkout-button">Checkout</button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Recommend></Recommend>
    </div>
  );
}

export default Cart;

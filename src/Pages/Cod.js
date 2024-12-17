import React, { useState } from 'react'
import Header from '../components/Header'
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import './cod.css'
function Cod() {
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");

  const handlePaymentModeChange = (mode) => {
    setSelectedPaymentMode(mode);
  };
  return (
    <div>
        <Header></Header>
        <Container fluid className="cod-container my-5">
        <Row className="no-gutters">
          {/* Left Column */}
          <Col xs={12} md={7} className="cod-left-column mb-4 mb-md-0">
      <Card className="cod-item mb-4">
        <Card.Body className="p-3 card-body-60" >
          <Row className="align-items-center mb-3">
            <Col>
              <Card.Title className="cod-title">Choose Payment Mode</Card.Title>
            </Col>
          </Row>
          <Card.Text>
            {/* Payment Option: Cash on Delivery */}
            <Row className="align-items-center mb-3" style={{display:'flex'}}>
              <Col xs={1} className="text-center">
                <i className="fa-solid fa-money-check"></i>
              </Col>
              <Col xs={9}>
                <p className="cod-text">Cash on Delivery</p>
                <div className="text-muted cod-text">Estimated Arrival: 7 July 2024</div>
              </Col>
              <Col xs={2} className="text-end">
                <div className="custom-radio-container">
                  <input
                    type="radio"
                    name="payment-mode"
                    id="cod"
                    className="custom-radio"
                    onChange={() => handlePaymentModeChange("cod")}
                  />
                  <label htmlFor="cod"></label>
                </div>
              </Col>
            </Row>

            {/* Payment Option: UPI */}
            <Row className="align-items-center mb-3">
              <Col xs={1} className="text-center">
                <i className="fa-solid fa-money-check"></i>
              </Col>
              <Col xs={9}>
                <p className="cod-text">UPI</p>
                <div className="text-muted cod-text">Estimated Arrival: 7 July 2024</div>
              </Col>
              <Col xs={2} className="text-end">
                <div className="custom-radio-container">
                  <input
                    type="radio"
                    name="payment-mode"
                    id="upi"
                    className="custom-radio"
                    onChange={() => handlePaymentModeChange("upi")}
                  />
                  <label htmlFor="upi"></label>
                </div>
              </Col>
            </Row>
            {selectedPaymentMode === "upi" && (
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter UPI ID"
                  className='payment-form'
                />
                <button className="upi-continue-button mt-2">Continue</button>
              </Form.Group>
            )}

            {/* Payment Option: Card */}
            <Row className="align-items-center mb-3">
              <Col xs={1} className="text-center">
                <i className="fa-solid fa-money-check"></i>
              </Col>
              <Col xs={9}>
                <p className="cod-text">Card</p>
                <div className="text-muted cod-text">Estimated Arrival: 7 July 2024</div>
              </Col>
              <Col xs={2} className="text-end">
                <div className="custom-radio-container">
                  <input
                    type="radio"
                    name="payment-mode"
                    id="card"
                    className="custom-radio"
                    onChange={() => handlePaymentModeChange("card")}
                  />
                  <label htmlFor="card"></label>
                </div>
              </Col>
            </Row>
            {selectedPaymentMode === "card" && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control type="text" className='payment-form' placeholder="Card Number" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Row>
                    <Col>
                      <Form.Control                   className='payment-form'
 type="text" placeholder="MM/YY" />
                    </Col>
                    <Col>
                      <Form.Control                   className='payment-form'
 type="text" placeholder="CVV" />
                    </Col>
                  </Row>
                </Form.Group>
                <button className="upi-continue-button">Continue</button>
              </Form>
            )}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>




          {/* Right Column */}
          <Col xs={12} md={5} className="address-right-column">
            <Card className="cod-checkout p-3 shadow">
              <Card.Body>
                <div className="cod-points-info text-center bg-light p-3">
                  <p className="m-0 cod-points">
                    1 Point = 1 Rupee: For example, if you have 40 points, you
                    can use them as 40 rupees on your purchase.
                  </p>
                  <button className="cod-button1 mt-2">
                    Claim with Syopi points
                  </button>
                </div>
                <Card.Text className="mt-3">
                  <div className="d-flex justify-content-between">
                    <p className="cod-check-total">Total Items:</p>
                    <p className="text-end cod-check-total">6</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="cod-check-total">Total MRP:</p>
                    <p className="text-end cod-check-total">$149.95</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="cod-check-total">Total Discount:</p>
                    <p className="text-end points">$10.00</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="cod-check-total">Syopi Points:</p>
                    <p className="text-end points">$5.00</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="cod-check-total">Total Price:</p>
                    <p className="text-end cod-check-total">$134.95</p>
                  </div>
                </Card.Text>
                <button className="w-100 mb-2 cod-button">Checkout</button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Cod
import React from 'react';
import './Order.css';
import Header from '../components/Header';
import { Card, Col, Container, Row } from 'react-bootstrap';
import C1 from '../images/Cart1.jpeg';
import C2 from '../images/Cart2.jpeg';

function Orders() {
  return (
    <div>
      <Header></Header>
      <p className="order-title">My Orders</p>

      <Container fluid className="order-container my-5 order-row">
      <Row className="track-order-row">
  <Col xs={12} md={8} className='tr-o'>
    <div className="order-info">
      Order <span className='ms-2' style={{ color: '#49A1F7' }}>#ORD123456789</span>
    </div>
    <p className="order-date">Order Placed Date: 2024-11-04</p>
  </Col>
  <Col xs={12} md={4} className="text-end">
    <button className="track-order-btn">Track Order</button>
  </Col>
</Row>

        <Row className="no-gutters align-items-start ">
          {/* First Column: Product Card */}
          <Col xs={12} md={6} className="order-left-column mb-4 mb-md-0">
  <Card className="order-item mb-4">
    <Row className="align-items-center">
      {/* Image Section */}
      <Col xs={12} sm={4} className="d-flex justify-content-center align-items-center">
        <img src={C1} alt="Product" className="order-image img-fluid" />
      </Col>

      {/* Details Section */}
      <Col xs={12} sm={8} className="d-flex flex-column">
        <Card.Body className="p-0 d-flex flex-column justify-content-between h-100">
          {/* Title */}
          <Card.Title className="order-titles mb-2">
          Drawstring Color Block Long 
          Sleeve Jacket          </Card.Title>

          {/* Color and Size */}
          <div className="d-flex align-items-center gap-1 mb-1">
            <p className="color-size m-0">Color: Yellow</p>
            <p className="color-size m-0 ms-2">Size: M</p>
          </div>

          {/* Quantity and Price */}
          <div className="d-flex align-items-center gap-3 mb-1">
            <p className="quantity m-0">Qty: 2</p>
            <p className="price m-0 ms-5">
              RS. <span style={{ color: '#1DA69E' }}>1280</span>
            </p>
          </div>
        </Card.Body>
      </Col>
    </Row>
  </Card>
</Col>




          {/* Second Column: Order Status */}
          <Col xs={12} md={3} className="text-center mb-4 mb-md-0 mt-5">
            <div className="order-status">
            <p className='order-status1'>Order Status</p>
            <p className='order-status2'>Shipped</p>
            </div>
          </Col>

          {/* Third Column: Delivery Expected By */}
          <Col xs={12} md={3} className="text-center mt-5">
            <div className="delivery-date">
            <p className='delivery-expect1'>Delivery Expected By</p>
            <p className='delivery-expect2'>24 December 2024</p>
            </div>
          </Col>
        </Row>

        {/* Second Order */}
        <Row className="no-gutters align-items-start mt-4">
          {/* First Column: Product Card */}
          <Col xs={12} md={6} className="order-left-column mb-4 mb-md-0">
  <Card className="order-item mb-4 h-100">
    <Row className="align-items-center h-100">
      {/* Image Section */}
      <Col xs={12} sm={4} className="d-flex justify-content-center align-items-center">
        <img src={C2} alt="Product" className="order-image img-fluid" />
      </Col>

      {/* Details Section */}
      <Col xs={10} sm={8}>
        <Card.Body className="p-0 d-flex flex-column justify-content-between h-100">
          {/* Title */}
          <Card.Title className="order-titles mb-2">
          Drawstring Color Block Long 
          Sleeve Jacket          </Card.Title>

          {/* Color and Size */}
          <div className="d-flex align-items-center gap-1 mb-1">
            <p className="color-size m-0">Color: Yellow</p>
            <p className="color-size m-0 ms-2">Size: M</p>
          </div>

          {/* Quantity and Price */}
          <div className="d-flex align-items-center gap-3 mb-1">
            <p className="quantity m-0">Qty: 2</p>
            <p className="price m-0 ms-5">
              RS. <span style={{ color: '#1DA69E' }}>1280</span>
            </p>
          </div>
        </Card.Body>
      </Col>
    </Row>
  </Card>
</Col>

          {/* Second Column: Order Status */}
          <Col xs={12} md={3} className="text-center mb-4 mb-md-0 mt-5">
            <div className="order-status">
              <p className='order-status1'>Order Status</p>
              <p className='order-status2'>Shipped</p>
            </div>
          </Col>

          {/* Third Column: Delivery Expected By */}
          <Col xs={12} md={3} className="text-center mt-5">
            <div className="delivery-date">
              <p className='delivery-expect1'>Delivery Expected By</p>
              <p className='delivery-expect2'>24 December 2024</p>
            </div>
          </Col>
        </Row>
        <Row className="cancel-order-row">
  <Col>
    <div className="cancel-order-text">Cancel Order</div>
  </Col>
  <Col className="text-end">
    <p className="order-price">RS. <span style={{color:'#1DA69E'}}>1280</span></p>
  </Col>
</Row>

      </Container>
    </div>
  );
}

export default Orders;

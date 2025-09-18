import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button, Spinner, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleOrderApi } from "../services/allApi";
import "./singleorder.css";
import { BASE_URL } from "../services/baseUrl";

function SingleOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await getSingleOrderApi(id);
      console.log("Single order response:", response);
      if (response.data && response.data.success) {
        setOrder(response.data.order);
      } else {
        setError("Failed to fetch order details");
      }
    } catch (err) {
      setError("Error fetching order details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get status badge color
  const getStatusBadgeColor = (status) => {
  switch (status) {
    case "Delivered":
      return "success";
    case "Cancelled":
    case "Returned":
      return "danger";
    case "Processing":
      return "primary";
    case "Shipping":
    case "In-Transit":
      return "info";
    case "Pending":
      return "warning";
    case "Confirmed":
      return "secondary";
    default:
      return "secondary";
  }


  };

  const getProductImage = (product) => {
    if (product?.productId?.images?.length > 0) {
      return product.productId.images[0];
    }
    return null;
  };

  if (loading) {
    return (
      <div className="order-loading-container">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="order-error-container">
        <div className="order-error-content">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <Button variant="primary" onClick={fetchOrder}>Try Again</Button>
        </div>
      </Container>
    );
  }

  const productNavigate = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <Container className="order-main-container">
      <Card className="order-card">
        <Card.Header className="order-card-header">
          <div className="order-header-content">
            <div className="order-id">
              Order #: <span className="order-id-value">{order?._id}</span>
            </div>
            <div className="order-status">
              Status: <Badge bg={getStatusBadgeColor(order?.status)}>{order?.status}</Badge>
            </div>
          </div>
        </Card.Header>
        
        <Card.Body>
          <h5 className="mb-4">Order Summary</h5>
          
          <Row className="mb-4">
            <Col md={6}>
              <div className="order-summary-item">
                <span className="order-summary-label">Order Date:</span>
                <span className="order-summary-value">{formatDate(order?.createdAt)}</span>
              </div>
              <div className="order-summary-item">
                <span className="order-summary-label">Payment Method:</span>
                <span className="order-summary-value">{order?.paymentMethod || "Cash on Delivery"}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="order-summary-item">
                <span className="order-summary-label">Total Items:</span>
                <span className="order-summary-value">{order?.products?.length || 0}</span>
              </div>
              <div className="order-summary-item">
                <span className="order-summary-label">Total Amount:</span>
                <span className="order-summary-value">₹{order?.finalPayableAmount || 0}</span>
              </div>
            </Col>
          </Row>

          <h5 className="mb-3">Products</h5>
          
          <ListGroup className="mb-4">
            {order?.products?.map((product, index) => {
              const productImage = getProductImage(product);
              const imageUrl = productImage ? `${BASE_URL}/uploads/${productImage}` : null;
              
              return (
                <ListGroup.Item key={index} className="product-item">
                  <Row className="align-items-center">
                    <Col xs={3} md={2}>
                      <div 
                        className="order-product-image-container" 
                        onClick={() => productNavigate(product.productId?._id)}
                      >
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={product?.productId?.name} 
                            className="order-product-image" 
                          />
                        ) : (
                          <div 
                            className="order-product-color" 
                            style={{ backgroundColor: product?.color || "#dd151b" }}
                          ></div>
                        )}
                      </div>
                    </Col>
                    <Col xs={9} md={6}>
                      <h6 className="product-title">{product?.productId?.name}</h6>
                      <div className="product-details2">
                        <span className="detail-item">Color: <Badge bg="light" text="dark">{product?.color}</Badge></span>
                        <span className="detail-item">Size: {product?.size}</span>
                        <span className="detail-item">Qty: {product?.quantity}</span>
                      </div>
                    </Col>
                    <Col xs={12} md={4} className="text-md-end mt-2 mt-md-0">
                      <div className="product-price">
                        <span className="final-price">₹{(product?.price * product?.quantity).toFixed(2)}</span>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              );
            })}
          </ListGroup>

          <div className="order-section-divider"></div>

          <Row className="order-info-row">
            <Col lg={6} className="order-address-col">
              <h6 className="order-section-title">Shipping Address</h6>
              <Card className="order-address-card">
                <Card.Body>
                  {order?.shippingAddress ? (
                    <div className="order-address-content">
                      <div className="order-address-name">{order.shippingAddress.name}</div>
                      <div className="order-address-line">
                        {order.shippingAddress.address}
                        {order.shippingAddress.landmark && `, Near ${order.shippingAddress.landmark}`}
                      </div>
                      <div className="order-address-line">
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </div>
                      <div className="order-address-contact">
                        <i className="bi bi-telephone"></i> {order.shippingAddress.number}
                        {order.shippingAddress.alternatenumber && `, ${order.shippingAddress.alternatenumber}`}
                      </div>
                      <Badge bg="light" text="dark" className="order-address-type">
                        {order.shippingAddress.addressType}
                      </Badge>
                    </div>
                  ) : (
                    <div className="order-address-empty">Address information not available</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={6} className="order-timeline-col">
              <h6 className="order-section-title">Order Timeline</h6>
              <div className="order-timeline">
                <div className="order-timeline-item">
                  <div className="order-timeline-icon order-timeline-icon-success"></div>
                  <div className="order-timeline-content">
                    <div className="order-timeline-date">{formatDate(order?.createdAt)}</div>
                    <div className="order-timeline-text">Order Placed</div>
                  </div>
                </div>
                
                {order?.status === "Processing" && (
                  <div className="order-timeline-item">
                    <div className="order-timeline-icon order-timeline-icon-primary"></div>
                    <div className="order-timeline-content">
                      <div className="order-timeline-date">{formatDate(order?.updatedAt)}</div>
                      <div className="order-timeline-text">Processing Order</div>
                    </div>
                  </div>
                )}
                
                {order?.status === "Shipped" && (
                  <div className="order-timeline-item">
                    <div className="order-timeline-icon order-timeline-icon-info"></div>
                    <div className="order-timeline-content">
                      <div className="order-timeline-date">{formatDate(order?.updatedAt)}</div>
                      <div className="order-timeline-text">Order Shipped</div>
                    </div>
                  </div>
                )}
                
                {order?.status === "Cancelled" && (
                  <div className="order-timeline-item">
                    <div className="order-timeline-icon order-timeline-icon-danger"></div>
                    <div className="order-timeline-content">
                      <div className="order-timeline-date">{formatDate(order?.updatedAt)}</div>
                      <div className="order-timeline-text">Order Cancelled</div>
                      {order?.cancellationOrReturnReason && (
                        <div className="order-timeline-details">
                          Reason: {order.cancellationOrReturnReason}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {order?.status === "Delivered" && (
                  <div className="order-timeline-item">
                    <div className="order-timeline-icon order-timeline-icon-success"></div>
                    <div className="order-timeline-content">
                      <div className="order-timeline-date">{formatDate(order?.deliveredAt)}</div>
                      <div className="order-timeline-text">Order Delivered</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <h6 className="order-section-title">Payment Summary</h6>
                <Card className="order-delivery-card">
                  <Card.Body>
                    <div className="order-delivery-item">
                      <div className="order-delivery-content">
                        <div className="order-delivery-label">Subtotal</div>
                        <div className="order-delivery-value">₹{order?.totalPrice?.toFixed(2) || 0}</div>
                      </div>
                    </div>
                    
                    <div className="order-delivery-item">
                      <div className="order-delivery-content">
                        <div className="order-delivery-label">Discount</div>
                        <div className="order-delivery-value">-₹{order?.discountedAmount?.toFixed(2) || 0}</div>
                      </div>
                    </div>
                    
                    <div className="order-delivery-item">
                      <div className="order-delivery-content">
                        <div className="order-delivery-label">Delivery Charge</div>
                        <div className="order-delivery-value">₹{order?.deliveryCharge?.toFixed(2) || 0}</div>
                      </div>
                    </div>
                    
                    <div className="order-delivery-item">
                      <div className="order-delivery-content">
                        <div className="order-delivery-label">Total Amount</div>
                        <div className="order-delivery-value fw-bold">₹{order?.finalPayableAmount?.toFixed(2) || 0}</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SingleOrder;
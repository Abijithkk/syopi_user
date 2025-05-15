import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleOrderApi } from "../services/allApi";
import "./singleorder.css";
import { BASE_URL } from "../services/baseUrl";

function SingleOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate=useNavigate();

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await getSingleOrderApi(id);
      console.log("singleorder", response);
      
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
        return "danger";
      case "Processing":
        return "primary";
      case "Shipped":
        return "info";
      default:
        return "secondary";
    }
  };

  // Helper function to find variant image based on order color
  const getVariantImage = () => {
    if (!order?.productId?.variants || !order?.color) return null;
    
    const variant = order.productId.variants.find(v => v.color === order.color);
    if (variant && variant.images && variant.images.length > 0) {
      return variant.images[0];
    }
    return order.productId.images?.[0] || null;
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

  // Get variant image
  const productImage = getVariantImage();
  const imageUrl = productImage ? `${BASE_URL}/uploads/${productImage}` : null;
const productNavigate=(id)=>{
    navigate(`/product/${id}`)
}
  return (
    <Container className="order-main-container">
      <Card className="order-card">
        <Card.Header className="order-card-header">
          <div className="order-header-content">
            <div className="order-id">
              Order #: <span className="order-id-value">{order?.orderId}</span>
            </div>
            <div className="order-status">
              Status: <Badge bg={getStatusBadgeColor(order?.status)}>{order?.status}</Badge>
            </div>
          </div>
        </Card.Header>
        
        <Card.Body>
          <Row className="order-content-row">
            <Col lg={4} md={5} className="order-product-col">
              <div className="order-product-image-container" onClick={()=> productNavigate(order.productId?._id)}>
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={order?.productId?.name} 
                    className="order-product-image" 
                  />
                ) : (
                  <div 
                    className="order-product-color" 
                    style={{ backgroundColor: order?.color || "#dd151b" }}
                  ></div>
                )}
                <div className="order-product-badge">
                  <Badge bg="light" text="dark" className="order-color-badge">
                    {order?.colorName || "Crimson Red"}
                  </Badge>
                </div>
              </div>
            </Col>
            
            <Col lg={8} md={7}>
              <div className="order-product-details">
                <h5 className="order-product-title">{order?.productId?.name || "Symbol Regular Fit Full Sleeve Shirt For Mens"}</h5>
                
                <div className="order-product-meta">
                  <Row>
                    <Col sm={4} xs={6} className="order-meta-item">
                      <div className="order-meta-label">Product Type</div>
                      <div className="order-meta-value">{order?.productId?.productType || "Dress"}</div>
                    </Col>
                    <Col sm={4} xs={6} className="order-meta-item">
                      <div className="order-meta-label">Size</div>
                      <div className="order-meta-value">{order?.size || "S"}</div>
                    </Col>
                    <Col sm={4} xs={6} className="order-meta-item">
                      <div className="order-meta-label">Quantity</div>
                      <div className="order-meta-value">{order?.quantity || 1}</div>
                    </Col>
                    <Col sm={4} xs={6} className="order-meta-item">
                      <div className="order-meta-label">Price</div>
                      <div className="order-meta-value">₹{order?.price || 0}</div>
                    </Col>
                    <Col sm={4} xs={6} className="order-meta-item">
                      <div className="order-meta-label">Discount</div>
                      <div className="order-meta-value">₹{order?.discountedPrice || 0}</div>
                    </Col>
                    <Col sm={4} xs={6} className="order-meta-item">
                      <div className="order-meta-label">Total</div>
                      <div className="order-meta-value order-meta-value-bold">₹{order?.itemTotal || 0}</div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>

          <div className="order-section-divider"></div>

          <Row className="order-info-row">
            <Col lg={4} md={6} className="order-address-col">
              <h6 className="order-section-title">Shipping Address</h6>
              <Card className="order-address-card">
                <Card.Body>
                  {order?.addressId ? (
                    <div className="order-address-content">
                      <div className="order-address-name">{order.addressId.name}</div>
                      <div className="order-address-line">
                        {order.addressId.address}
                        {order.addressId.landmark && `, Near ${order.addressId.landmark}`}
                      </div>
                      <div className="order-address-line">
                        {order.addressId.city}, {order.addressId.state} - {order.addressId.pincode}
                      </div>
                      <div className="order-address-contact">
                        <i className="bi bi-telephone"></i> {order.addressId.number}
                        {order.addressId.alternatenumber && `, ${order.addressId.alternatenumber}`}
                      </div>
                      <Badge bg="light" text="dark" className="order-address-type">
                        {order.addressId.addressType}
                      </Badge>
                    </div>
                  ) : (
                    <div className="order-address-empty">Address information not available</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} md={6} className="order-timeline-col">
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
            </Col>
            
            <Col lg={4} md={12} className="order-delivery-col">
              <h6 className="order-section-title">Delivery Details</h6>
              <Card className="order-delivery-card">
                <Card.Body>
                  <div className="order-delivery-item">
                    <i className="bi bi-calendar-check order-delivery-icon"></i>
                    <div className="order-delivery-content">
                      <div className="order-delivery-label">Expected Delivery</div>
                      <div className="order-delivery-value">{order?.deliveryDetails?.deliveryDate || "N/A"}</div>
                    </div>
                  </div>
                  
                  <div className="order-delivery-item">
                    <i className="bi bi-truck order-delivery-icon"></i>
                    <div className="order-delivery-content">
                      <div className="order-delivery-label">Delivery Method</div>
                      <div className="order-delivery-value">{order?.paymentMode || "Standard Shipping"}</div>
                    </div>
                  </div>
                  
                  <div className="order-delivery-item">
                    <i className="bi bi-info-circle order-delivery-icon"></i>
                    <div className="order-delivery-content">
                      <div className="order-delivery-label">Delivery Message</div>
                      <div className="order-delivery-value">{order?.deliveryDetails?.deliveryMessage || "N/A"}</div>
                    </div>
                  </div>
                  
                  {order?.status !== "Cancelled" && order?.status !== "Delivered" && (
                    <div className="order-delivery-status">
                      <Badge bg="info" className="order-delivery-badge">
                        {order?.deliveryDetails?.deliveryMessage || "Delivery in progress"}
                      </Badge>
                    </div>
                  )}
                </Card.Body>
              </Card>
              
              {order?.status === "Delivered" && !order?.returnExpired && (
                <div className="order-action-container">
                  <Button variant="outline-primary" className="order-return-button">
                    Request Return
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SingleOrder;
import React, { useEffect, useState } from "react";
import "./Order.css";
import { Card, Col, Container, Row, Spinner, Alert, Modal, Form, Button } from "react-bootstrap";
import {
  cancelOrderApi,
 
  getUserOrdersApi,
  requestOrderReturnApi,
} from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [returnDescription, setReturnDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate=useNavigate();
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await getUserOrdersApi();

      if (response.success && response.data.success) {
        setOrders(response.data.vendorOrders);
      } else {
        setError("Failed to fetch orders. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("An error occurred while fetching your orders.");
    } finally {
      setLoading(false);
    }
  };

  // Function to open cancel modal
  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  // Function to open return modal
  const openReturnModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowReturnModal(true);
  };
  const ordernavigate = (id) => {
    navigate(`/singleorder/${id}`);
  };
  // Function to cancel an order
  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await cancelOrderApi(selectedOrderId, cancelReason);
      if (response.success) {
        // Close modal and reset form
        setShowCancelModal(false);
        setCancelReason("");
        setSelectedOrderId(null);
        // Refresh the orders list after cancellation
        fetchUserOrders();
      } else {
        alert("Failed to cancel order. Please try again.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("An error occurred while cancelling your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to request a return
  const handleReturnRequest = async () => {
    if (!returnReason.trim()) {
      alert("Please select a reason for return");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await requestOrderReturnApi(
        selectedOrderId,
        returnReason,
        returnDescription
      );
      if (response.success) {
        // Close modal and reset form
        setShowReturnModal(false);
        setReturnReason("");
        setReturnDescription("");
        setSelectedOrderId(null);
        // Refresh the orders list after return request
        fetchUserOrders();
      } else {
        alert("Failed to request return. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting return:", error);
      alert("An error occurred while requesting a return.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <div>
      <p className="order-title">My Orders</p>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : orders.length === 0 ? (
        <Alert variant="info">You don't have any orders yet.</Alert>
      ) : (
        orders.map((order, index) => (
          <Container
            fluid
            className="order-container my-5 order-row"
            key={order._id}
            onClick={() => ordernavigate(order._id)}

          >
            <Row className="track-order-row">
              <Col xs={12} md={8} className="tr-o">
                <div className="order-info">
                  Order{" "}
                  <span className="ms-2" style={{ color: "#49A1F7" }}>
                    #{order.orderId?._id || "N/A"}
                  </span>
                </div>
                <p className="order-date">
                  Order Placed Date: {formatDate(order.createdAt)}
                </p>
              </Col>
              <Col xs={12} md={4} className="text-end">
                <button className="track-order-btn">Track Order</button>
              </Col>
            </Row>

            <Row className="no-gutters align-items-start">
              {/* Product Card */}
              <Col xs={12} md={6} className="order-left-column mb-4 mb-md-0">
                <Card className="order-item mb-4">
                  <Row className="align-items-center">
                    {/* Image Section */}
                    <Col
                      xs={12}
                      sm={4}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <img
                        src={`${BASE_URL}/uploads/${
                          order.productId?.images?.[0] || "N/A"
                        }`}
                        alt={order.productId?.name || "Product"}
                        className="order-image img-fluid"
                      />
                    </Col>

                    {/* Details Section */}
                    <Col xs={12} sm={8} className="d-flex flex-column">
                      <Card.Body className="p-0 d-flex flex-column justify-content-between h-100">
                        {/* Title */}
                        <Card.Title className="order-titles mb-2">
                          {order.productId?.name || "Product Name"}
                        </Card.Title>

                        {/* Color and Size */}
                        <div className="d-flex align-items-center gap-1 mb-1">
                          <p className="color-size m-0">
                            Color: {order.colorName || "N/A"}
                          </p>
                          <p className="color-size m-0 ms-2">
                            Size: {order.size || "N/A"}
                          </p>
                        </div>

                        {/* Quantity and Price */}
                        <div className="d-flex align-items-center gap-3 mb-1">
                          <p className="quantity m-0">
                            Qty: {order.quantity || 0}
                          </p>
                          <p className="price m-0 ms-5">
                            RS.{" "}
                            <span style={{ color: "#1DA69E" }}>
                              {order.price || 0}
                            </span>
                          </p>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Order Status */}
              <Col xs={12} md={3} className="text-center mb-4 mb-md-0 mt-5">
                <div className="order-status">
                  <p className="order-status1">Order Status</p>
                  <p className="order-status2">
                    {order.status || "Processing"}
                  </p>
                </div>
              </Col>

              {/* Delivery Expected By */}
              <Col xs={12} md={3} className="text-center mt-5">
                <div className="delivery-date">
                  <p className="delivery-expect1">Delivery Expected By</p>
                  <p className="delivery-expect2">
                    {order.deliveryDetails?.deliveryDate
                      ? formatDate(order.deliveryDetails.deliveryDate)
                      : "Processing"}
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="cancel-order-row">
              <Col>
                {order.status === "Confirmed" && (
                  <div
                    className="cancel-order-text"
                    onClick={() => openCancelModal(order._id)}
                    style={{ cursor: "pointer" }}
                  >
                    Cancel Order
                  </div>
                )}
                {order.status === "Delivered" &&
                  order.returnStatus === "Not_requested" && (
                    <div
                      className="cancel-order-text"
                      
                      onClick={() => openReturnModal(order._id)}
                      style={{ cursor: "pointer" }}
                    >
                      Request Return
                    </div>
                  )}
                {order.returnStatus === "Requested" && (
                  <div className="return-status-text">Return Requested</div>
                )}
              </Col>
              <Col className="text-end">
                <p className="order-price">
                  RS.{" "}
                  <span style={{ color: "#1DA69E" }}>
                    {order.itemTotal || order.price * order.quantity}
                  </span>
                </p>
              </Col>
            </Row>
          </Container>
        ))
      )}

      {/* Cancel Order Modal */}
      <Modal 
        show={showCancelModal} 
        onHide={() => setShowCancelModal(false)}
        centered
        backdrop="static"
        className="order-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Please select a reason for cancellation:</Form.Label>
              <Form.Select 
                value={cancelReason} 
                onChange={(e) => setCancelReason(e.target.value)}
                required
              >
                <option value="">Select a reason</option>
                <option value="Changed my mind">Changed my mind</option>
                <option value="Found better price elsewhere">Found better price elsewhere</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Shipping time too long">Shipping time too long</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowCancelModal(false)}
          >
            Close
          </Button>
          <Button 
            style={{ 
              backgroundColor: "#1DA69E", 
              border: "none" 
            }}
            onClick={handleCancelOrder}
            disabled={isSubmitting || !cancelReason}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Cancellation'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Return Order Modal */}
      <Modal 
        show={showReturnModal} 
        onHide={() => setShowReturnModal(false)}
        centered
        backdrop="static"
        className="order-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Request Return</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Please select a reason for return:</Form.Label>
              <Form.Select 
                value={returnReason} 
                onChange={(e) => setReturnReason(e.target.value)}
                required
              >
                <option value="">Select a reason</option>
                <option value="Item damaged">Item damaged</option>
                <option value="Wrong item received">Wrong item received</option>
                <option value="Item defective">Item defective</option>
                <option value="Item not as described">Item not as described</option>
                <option value="Changed my mind">Changed my mind</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Additional Details (Optional):</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={returnDescription}
                onChange={(e) => setReturnDescription(e.target.value)}
                placeholder="Please provide any additional details about your return request..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowReturnModal(false)}
          >
            Close
          </Button>
          <Button 
            style={{ 
              backgroundColor: "#1DA69E", 
              border: "none" 
            }}
            onClick={handleReturnRequest}
            disabled={isSubmitting || !returnReason}
          >
            {isSubmitting ? 'Processing...' : 'Submit Return Request'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Orders;
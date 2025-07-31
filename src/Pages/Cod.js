import React, { memo, useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./cod.css";
import { getCheckoutByIdApi, placeOrderApi } from "../services/allApi";
import ErrorBoundary from "../components/ErrorBoundary";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Skeleton from "react-loading-skeleton";

const CheckoutSummary = memo(({ checkoutData }) => (
  <Card.Text className="mt-3">
    <div className="d-flex justify-content-between">
      <p className="address-check-total">Total Items:</p>
      <p className="text-end address-check-total">
        {checkoutData?.items?.length || 0}
      </p>
    </div>
    <div className="d-flex justify-content-between">
      <p className="address-check-total">Total MRP:</p>
      <p className="text-end address-check-total">{checkoutData?.subtotal}</p>
    </div>
    <div className="d-flex justify-content-between">
      <p className="address-check-total">Delivery Charge</p>
      <p className="text-end address-check-total">{checkoutData?.deliveryCharge}</p>
    </div>
    <div className="d-flex justify-content-between">
      <p className="address-check-total">Total Discount:</p>
      <p className="text-end points">{checkoutData?.ReducedDiscount}</p>
    </div>
    <div className="d-flex justify-content-between">
      <p className="address-check-total">Syopi Points:</p>
      <p className="text-end points">{checkoutData?.coinsApplied}</p>
    </div>
    <div className="d-flex justify-content-between">
      <p className="address-check-total">Total Price:</p>
      <p className="text-end address-check-total">{checkoutData?.finalTotal}</p>
    </div>
  </Card.Text>
));

function Cod() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState({
    loading: true,
    error: null,
    checkoutData: null,
    checkoutId: null,
  });

  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (!id) {
        setState(prev => ({ 
          ...prev, 
          error: "Missing checkout ID", 
          loading: false 
        }));
        return;
      }

      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await getCheckoutByIdApi(id);
        
        if (response.success) {
          setState((prev) => ({
            ...prev,
            checkoutData: response.data,
            checkoutId: response.data._id,
            loading: false,
          }));
        } else {
          throw new Error(response.error || "Failed to fetch checkout details");
        }
      } catch (error) {
        console.error("Checkout fetch error:", error);
        setState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
        toast.error("Failed to load checkout details. Please try again later.");
      }
    };

    fetchCheckoutData();
  }, [id]);

  const handlePlaceOrder = async () => {
    // Check if we have the required data
    if (!state.checkoutData) {
      toast.error("Checkout data is missing. Please refresh the page.");
      return;
    }

    // Get address ID from localStorage
    const addressId = localStorage.getItem("AddressId");
    if (!addressId) {
      toast.error("Please select a delivery address first.");
      return;
    }

    if (!state.checkoutId) {
      toast.error("Checkout ID is missing. Please start over.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        checkoutId: state.checkoutId,
        addressId: addressId,
        deliveryCharge: state.checkoutData.deliveryCharge || 0,
        paymentMethod: "Cash on Delivery"
      };

      const response = await placeOrderApi(orderData);

      if (response.success) {
        toast.success("Order placed successfully!");
        navigate("/order-success", { 
          state: { 
            orderId: response.order?._id,
            coinsEarned: response.coinsEarned
          } 
        });
      } else {
        throw new Error(response.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state.error) {
    return (
      <div className="text-center mt-5">
        <h3>Something went wrong</h3>
        <p className="text-danger">{state.error}</p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div>
        <Container fluid className="cod-container ">
          <Row className="no-gutters">
            {/* Left Column */}
            <Col xs={12} md={7} className="cod-left-column mb-4 mb-md-0">
              <Card className="cod-item mb-4">
                <Card.Body className="p-3 card-body-60">
                  <Row className="align-items-center mb-3">
                    <Col>
                      <Card.Title className="cod-title">
                        Cash on Delivery
                      </Card.Title>
                    </Col>
                  </Row>
                  <Card.Text>
                    <Row className="align-items-center mb-3" style={{ display: "flex" }}>
                      <Col xs={1} className="text-center">
                        <i className="fa-solid fa-money-check"></i>
                      </Col>
                      <Col xs={9}>
                        <p className="cod-text">Pay when you receive your order</p>
                       
                      </Col>
                      <Col xs={2} className="text-end">
                        <div className="custom-radio-container">
                          <input
                            type="radio"
                            name="payment-mode"
                            id="cod"
                            className="custom-radio"
                            checked
                            readOnly
                          />
                          <label htmlFor="cod"></label>
                        </div>
                      </Col>
                    </Row>
                  </Card.Text>
                </Card.Body>
              </Card>
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

                  {state.loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        width="100%"
                        height={20}
                        className="mb-2"
                      />
                    ))
                  ) : (
                    <CheckoutSummary checkoutData={state.checkoutData} />
                  )}

                  <button
                    className="w-100 mb-2 checkout-button"
                    disabled={isSubmitting}
                    onClick={handlePlaceOrder}
                  >
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default Cod;
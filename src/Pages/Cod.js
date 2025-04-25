import React, { memo, useEffect, useState } from 'react'
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import './cod.css'
import {  getCheckoutByIdApi } from "../services/allApi";
import ErrorBoundary from "../components/ErrorBoundary"; // Assuming you'll create this
import LeavePageConfirmation from "../components/LeavePageConfirmation";
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';



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
      <p className="text-end address-check-total">{checkoutData?.finalTotal}</p>
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
      <p className="text-end address-check-total">{checkoutData?.subtotal}</p>
    </div>
  </Card.Text>
));
function Cod() {
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const { id } = useParams();
   const [state, setState] = useState({
      showAddressCard: false,
      addresses: [],
      loading: true,
      error: null,
      selectedAddress: null,
      checkoutData: null,
    });
  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (!id) return;

      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await getCheckoutByIdApi(id);
        if (response.success) {
          setState((prev) => ({
            ...prev,
            checkoutData: response.data,
            checkoutId: response.data._id, // Ensure checkoutId is stored correctly

            loading: false,
          }));
        } else {
          throw new Error(response.error || "Failed to fetch checkout details");
        }
      } catch (error) {
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
  const handlePaymentModeChange = (mode) => {
    setSelectedPaymentMode(mode);
  };
  return (
        <ErrorBoundary>
    
    <div>
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
                              disabled={state.selectedAddress === null}
                              // onClick={handleContinue}
                            >
                              Continue
                            </button>
                          </Card.Body>
                        </Card>
                      </Col>
        </Row>
      </Container>
    </div>
    <ToastContainer></ToastContainer>
      <LeavePageConfirmation></LeavePageConfirmation>
    </ErrorBoundary>
  )
}

export default Cod
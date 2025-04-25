import React, { useEffect, useState, useCallback, memo } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./address.css";
import AddressCard from "../components/AddressCard";
import { getAddressApi, getCheckoutByIdApi } from "../services/allApi";
import ErrorBoundary from "../components/ErrorBoundary"; // Assuming you'll create this
import LeavePageConfirmation from "../components/LeavePageConfirmation";

// Memoized skeleton loader component
const AddressSkeleton = memo(() => (
  <Card className="address-item mb-4">
    <Row className="align-items-center">
      <Col xs={12} sm={8}>
        <Card.Body className="p-0">
          <Row className="align-items-center">
            <Col xs="auto">
              <Skeleton width={20} height={20} />
            </Col>
            <Col>
              <Skeleton width="50%" height={20} />
            </Col>
          </Row>
          <Card.Text>
            <Skeleton width="80%" height={15} />
            <Skeleton width="60%" height={15} />
          </Card.Text>
        </Card.Body>
      </Col>
    </Row>
  </Card>
));

// Memoized address item component
const AddressItem = memo(({ address, index, selectedAddress, onSelect }) => (
  <Card className="address-item mb-4">
    <Row className="align-items-center">
      <Col xs={12} sm={8}>
        <Card.Body className="p-0">
          <Row className="align-items-center">
            <Col xs="auto">
              <input
                type="checkbox"
                className="custom-checkbox"
                id={`checkbox-${index}`}
                checked={selectedAddress === index}
                onChange={() => onSelect(index)}
              />
            </Col>
            <Col>
              <Card.Title className="address-title">{address.name}</Card.Title>
            </Col>
          </Row>
          <Card.Text>
            <p className="color-size">{address.address}</p>
            <p className="color-size" style={{ whiteSpace: "nowrap" }}>
              Phone Number: {address.number}
            </p>
          </Card.Text>
        </Card.Body>
      </Col>
    </Row>
  </Card>
));

// Memoized checkout summary component
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

function Address() {
  const [state, setState] = useState({
    showAddressCard: false,
    addresses: [],
    loading: true,
    error: null,
    selectedAddress: null,
    checkoutData: null,
  });
  const { id } = useParams();

  // Memoized handlers
  const handleAddressSuccess = useCallback(() => {
    setState((prev) => ({ ...prev, showAddressCard: false }));
  }, []);

  const handleSelect = useCallback((index) => {
    setState((prev) => ({ ...prev, selectedAddress: index }));
  }, []);

  const handleShowAddressCard = useCallback(() => {
    setState((prev) => ({ ...prev, showAddressCard: true }));
  }, []);

  // Fetch addresses with error handling
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await getAddressApi();
        if (response.success) {
          setState((prev) => ({
            ...prev,
            addresses: response.data,
            loading: false,
          }));
        } else {
          throw new Error(response.error || "Failed to fetch addresses");
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
        toast.error("Failed to load addresses. Please try again later.");
      }
    };

    fetchAddresses();
  }, []);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (state.selectedAddress === null) {
      toast.warn("Please select an address!", { position: "top-right" });
      return;
    }
  
    const selectedAddressId = state.addresses[state.selectedAddress]?._id;
    if (selectedAddressId) {
      localStorage.setItem("AddressId", selectedAddressId);
    }
  
    // Ensure `state.checkoutId` is available
    const checkoutId = state.checkoutId || "defaultId"; // Use a fallback if checkoutId is missing
  
    navigate(`/cod/${checkoutId}`);
  };
  

  // Fetch checkout data with error handling
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

  return (
    <ErrorBoundary>
      <div>
        <Container fluid className="address-container my-5">
          <Row className="no-gutters">
            {/* Left Column */}
            <Col xs={12} md={7} className="address-left-column mb-4 mb-md-0">
              {state.loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <AddressSkeleton key={index} />
                ))
              ) : state.addresses.length > 0 ? (
                state.addresses.map((address, index) => (
                  <AddressItem
                    key={index}
                    address={address}
                    index={index}
                    selectedAddress={state.selectedAddress}
                    onSelect={handleSelect}
                  />
                ))
              ) : (
                <p>No addresses found.</p>
              )}

              {state.showAddressCard && (
                <AddressCard onSuccess={handleAddressSuccess} />
              )}

              {!state.showAddressCard && (
                <button
                  className="w-100 add-shipping-button"
                  onClick={handleShowAddressCard}
                >
                  <i className="fa fa-plus-circle me-3 fs-5"></i> Add New
                  Shipping Address
                </button>
              )}
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
                    onClick={handleContinue}
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
  );
}

export default Address;

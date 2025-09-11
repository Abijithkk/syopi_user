import React, { useEffect, useState, useCallback, memo } from "react";
import { Container, Row, Col, Card, Form, InputGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./address.css";
import AddressCard from "../components/AddressCard";
import {
  applyCouponApi,
  applyCoinsApi,
  getAddressApi,
  getAvailableCouponsApi,
  getCheckoutByIdApi,
  getProfileApi,
  getCoinValueApi,
} from "../services/allApi";
import ErrorBoundary from "../components/ErrorBoundary";

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

const CheckoutSummary = memo(({ checkoutData }) => (
  <Card.Text className="mt-3">
    <div className="d-flex justify-content-between">
      <p className="address-check-total">Total Items:</p>
      <p className="text-end address-check-total">
        {checkoutData?.items?.length || 0}
      </p>
    </div>

    <div className="d-flex justify-content-between">
      <p className="address-check-total">Delivery Charge</p>
      <p className="text-end address-check-total">
        ₹{checkoutData?.deliveryCharge}
      </p>
    </div>


      <div className="d-flex justify-content-between">
      <p className="address-check-total">Syopi Points:</p>
      <p className="text-end points">🪙{checkoutData?.coinsApplied || 0}</p>
    </div>
    <div className="d-flex justify-content-between">
      <p className="address-check-total">Total Price:</p>
      <p className="text-end address-check-total">
        ₹{checkoutData?.finalTotal}
      </p>
    </div>
    
  </Card.Text>
));

const CouponSection = memo(
  ({ checkoutId, onCouponApplied, availableCoupons, loading }) => {
    const [couponCode, setCouponCode] = useState("");
    const [coupons, setCoupons] = useState([]);
    const [showCoupons, setShowCoupons] = useState(false);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
      if (availableCoupons?.length > 0) {
        setCoupons(availableCoupons);
      }
    }, [availableCoupons]);

    const handleApplyCoupon = async () => {
      if (!couponCode.trim()) {
        toast.error("Please enter a coupon code");
        return;
      }

      setApplying(true);
      try {
        const response = await applyCouponApi(checkoutId, couponCode);

        if (response.status === 200) {
          toast.success("Coupon applied successfully!");
          onCouponApplied(response.checkout || response.data);
          setCouponCode("");
        } else {
          toast.error(response.message || "Failed to apply coupon");
        }
      } catch (error) {
        toast.error("Error applying coupon");
        console.error(error);
      } finally {
        setApplying(false);
      }
    };

    const applyCouponFromList = async (code) => {
      setCouponCode(code);
      setApplying(true);
      try {
        const response = await applyCouponApi(checkoutId, code);

        if (response.status === 200) {
          toast.success("Coupon applied successfully!");
          onCouponApplied(response.checkout || response.data);
          setShowCoupons(false);
        } else {
          toast.error(response.message || "Failed to apply coupon");
        }
      } catch (error) {
        toast.error("Error applying coupon");
        console.error(error);
      } finally {
        setApplying(false);
      }
    };

    return (
      <div className="coupon-section mb-4">
        <h5>Apply Coupon</h5>
        <InputGroup>
          <Form.Control
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={applying}
          />
          <button
            className="btn btn-primary"
            onClick={handleApplyCoupon}
            disabled={applying}
          >
            {applying ? "Applying..." : "Apply"}
          </button>
        </InputGroup>

        <div className="mt-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setShowCoupons(!showCoupons)}
            disabled={loading}
          >
            {loading
              ? "Loading coupons..."
              : showCoupons
              ? "Hide Available Coupons"
              : "View Available Coupons"}
          </button>
        </div>

        {showCoupons && coupons?.length > 0 && (
          <div className="available-coupons mt-2">
            <div className="coupon-list">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="coupon-item">
                  <div className="coupon-details">
                    <strong>{coupon.code}</strong>
                    <p>{coupon.description}</p>
                    <small>Valid till: {coupon.endDate}</small>
                  </div>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => applyCouponFromList(coupon.code)}
                    disabled={applying}
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showCoupons && (!coupons || coupons.length === 0) && !loading && (
          <p className="text-muted mt-2">No coupons available for this order</p>
        )}
      </div>
    );
  }
);

function Address() {
  const [state, setState] = useState({
    showAddressCard: false,
    addresses: [],
    loading: true,
    error: null,
    selectedAddress: null,
    checkoutData: null,
    checkoutId: null,
    availableCoupons: [],
    couponsLoading: false,
    applyingCoins: false,
  });
  const [points, setPoints] = useState("");
  const [coins, setCoins] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  // Memoized handlers
  const handleAddressSuccess = useCallback(() => {
    setState((prev) => ({ ...prev, showAddressCard: false }));
    // Refresh addresses after adding a new one
    fetchAddresses();
  }, []);

  const handleSelect = useCallback((index) => {
    setState((prev) => ({ ...prev, selectedAddress: index }));
  }, []);

  const handleShowAddressCard = useCallback(() => {
    setState((prev) => ({ ...prev, showAddressCard: true }));
  }, []);

  // Extract fetchAddresses function to be reusable
  const fetchAddresses = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await getAddressApi();

      // Handle successful response with addresses
      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          addresses: response.data,
          loading: false,
        }));
      }
      // Handle 404 "No addresses found" as a valid state, not an error
      else if (
        response.status === 404 ||
        (response.message && response.message.includes("No addresses found"))
      ) {
        setState((prev) => ({
          ...prev,
          addresses: [],
          loading: false,
        }));
        // Optional - show a toast to prompt user to add an address
      }
      // Handle other errors
      else {
        throw new Error(
          response.error || response.message || "Failed to fetch addresses"
        );
      }
    } catch (error) {
      console.error("Address fetch error:", error);
      setState((prev) => ({
        ...prev,
        addresses: [],
        loading: false,
        error: error.message,
      }));
      // toast.error("Error loading addresses. Please try again later.");
    }
  };

  const fetchAvailableCoupons = async (checkoutId) => {
    if (!checkoutId) return;

    try {
      setState((prev) => ({ ...prev, couponsLoading: true }));
      const response = await getAvailableCouponsApi(checkoutId);

      if (response.status === 200 && response.coupons) {
        setState((prev) => ({
          ...prev,
          availableCoupons: response.coupons,
          couponsLoading: false,
        }));
      } else {
        setState((prev) => ({ ...prev, couponsLoading: false }));
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setState((prev) => ({ ...prev, couponsLoading: false }));
    }
  };

  const fetchSyopiPoints = async () => {
    try {
      setState((prev) => ({ ...prev, couponsLoading: true }));

      const response = await getProfileApi();

      if (response.status === 200 && response.data?.user) {
        setPoints(response.data.user.coins); // directly assign coins even if 0
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setState((prev) => ({ ...prev, couponsLoading: false }));
    }
  };

  useEffect(() => {
    fetchSyopiPoints();
  }, []);
  // Apply coins
  const handleApplyCoins = async () => {
    if (!state.checkoutId) {
      toast.error("Checkout information is missing");
      return;
    }

    setState((prev) => ({ ...prev, applyingCoins: true }));
    try {
      const response = await applyCoinsApi(state.checkoutId);
      console.log(response);

      if (response.status === 200) {
        toast.success("Syopi points applied successfully!");
        // Update checkout data - use the correct nested path
        setState((prev) => ({
          ...prev,
          checkoutData: response.data.checkout || response.data, // Fixed this line
          applyingCoins: false,
        }));
      } else {
        // Handle non-200 status codes (like 400) and show the API error message
        const errorMessage =
          response.error?.message ||
          response.message ||
          response.data?.message ||
          "Failed to apply points";
        toast.error(errorMessage);
        setState((prev) => ({ ...prev, applyingCoins: false }));
      }
    } catch (error) {
      console.error("Error applying points:", error);
      // Handle network errors or other exceptions
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error applying Syopi points";
      toast.error(errorMessage);
      setState((prev) => ({ ...prev, applyingCoins: false }));
    }
  };

  // Handle coupon applied
  const handleCouponApplied = useCallback((updatedCheckout) => {
    setState((prev) => ({
      ...prev,
      checkoutData: updatedCheckout,
    }));
  }, []);

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleContinue = () => {
    if (state.selectedAddress === null) {
      toast.error("Please select an address!");
      return;
    }

    const selectedAddressData = state.addresses[state.selectedAddress];

    if (!selectedAddressData || !selectedAddressData._id) {
      toast.error("Invalid address selection. Please try again.");
      return;
    }

    try {
      // Also store just the ID for backward compatibility
      localStorage.setItem("AddressId", selectedAddressData._id);

      const checkoutId = state.checkoutId || id;

      if (!checkoutId) {
        toast.error("Missing checkout information. Please try again.");
        return;
      }

      navigate(`/cod/${checkoutId}`);
    } catch (error) {
      console.error("Error saving address data:", error);
      toast.error(
        "There was a problem processing your selection. Please try again."
      );
    }
  };

  // Fetch checkout data with error handling
  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (!id) return;

      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await getCheckoutByIdApi(id);
        console.log(response)

        if (response.status === 200 && response.data) {
          setState((prev) => ({
            ...prev,
            checkoutData: response.data,
            checkoutId: response.data._id,
            loading: false,
          }));

          // Fetch available coupons after getting checkout data
          fetchAvailableCoupons(response.data._id);
        } else {
          throw new Error(
            response.error ||
              response.message ||
              "Failed to fetch checkout details"
          );
        }
      } catch (error) {
        console.error("Checkout data fetch error:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        toast.error("Failed to load checkout details. Please try again.");
      }
    };

    fetchCheckoutData();
  }, [id]);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await getCoinValueApi();

        if (response.status === 200 && response.data) {
          setCoins(response.data.coinValue);
        } else {
          throw new Error(
            response.error || response.message || "Failed to fetch coin details"
          );
        }
      } catch (error) {
        console.error("Checkout data fetch error:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        toast.error("Failed to load checkout details. Please try again.");
      }
    };

    fetchCoinData();
  }, []);

  // Specific error handling for checkout data - show error UI only for critical errors
  if (state.error && !state.checkoutData) {
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
        <Container fluid className="address-container">
          <Row className="no-gutters">
            {/* Left Column */}
            <Col xs={12} md={7} className="address-left-column mb-4 mb-md-0">
              <h4 className="mb-3">Select Delivery Address</h4>
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
                <div className="text-center p-4 bg-light rounded mb-4">
                  <p className="mb-2">
                    No addresses found. Please add a shipping address.
                  </p>
                </div>
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
                  {/* Coupon Section */}
                  {!state.loading && state.checkoutId && (
                    <CouponSection
                      checkoutId={state.checkoutId}
                      onCouponApplied={handleCouponApplied}
                      availableCoupons={state.availableCoupons}
                      loading={state.couponsLoading}
                    />
                  )}
                  <p>Available Coins: {points}</p>
                  <div className="address-points-info text-center bg-light p-3 mb-3">
                    <p className="m-0 address-points">
                      1 Point = {coins} Rupee: For example, if you have 40
                      points, you can use them as {coins * 40} rupees on your
                      purchase.
                    </p>

                    <button
                      className="checkout-button1 mt-2"
                      onClick={handleApplyCoins}
                      disabled={state.applyingCoins || !state.checkoutId}
                    >
                      {state.applyingCoins
                        ? "Applying..."
                        : "Claim with Syopi points"}
                    </button>
                  </div>

                  <h5>Order Summary</h5>
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
                    disabled={
                      state.selectedAddress === null ||
                      state.addresses.length === 0 ||
                      state.loading
                    }
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
    </ErrorBoundary>
  );
}

export default Address;

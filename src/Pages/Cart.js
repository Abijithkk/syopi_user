import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Cart.css";
import {
  checkoutCreateApi,
  getUserCartApi,
  removeProductFromCartApi,
  updateCartQuantityApi,
} from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Cart() {
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState([]);
  const [loadingItems, setLoadingItems] = useState({});
  const [removeLoading, setRemoveLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [authHandled, setAuthHandled] = useState(false);
  const isLoading = loadingItems[cartData._id];

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleAuthFailure = (message = "Session expired. Please sign in again.") => {
    if (authHandled) return;
    
    setAuthHandled(true);
    console.log("Authentication failure detected");
    
    // Dismiss any existing toasts before showing new one
    toast.dismiss();
    toast.error(message);
    
    // Clear invalid tokens
    localStorage.removeItem("accessuserToken");
    localStorage.removeItem("userId");
    
    // Navigate to signin after showing toast
    setTimeout(() => {
      navigate("/signin");
    }, 1000);
  };

  // Helper function to check if error is authentication related
  const isAuthError = (error, response) => {
    const authErrorMessages = [
      "No token provided",
      "Login Required",
      "Unauthorized"
    ];
    
    return (
      response?.status === 401 ||
      authErrorMessages.some(msg => 
        response?.error?.includes(msg) ||
        error?.response?.data?.error?.includes(msg) ||
        error?.message?.includes(msg)
      ) ||
      error?.response?.status === 401
    );
  };

const fetchCart = async () => {
  console.log("Fetching cart data...");
  
  const userId = localStorage.getItem("userId");
  console.log("Retrieved userId from localStorage:", userId);
  
  if (!userId) {
    console.warn("No userId found in localStorage.");
    toast.dismiss(); 
    toast.error("Please sign in.");
    setTimeout(() => {
      navigate("/signin");
    }, 1000);
    setLoading(false);
    return;
  }

  try {
    const response = await getUserCartApi(userId);
    console.log("Cart API response:", response);

    if (isAuthError(null, response)) {
      handleAuthFailure();
      return;
    }

    if (response.success) {
      console.log("Cart data fetched successfully.");
      setCartData(response.data);
    } else {
      console.error("Cart fetch failed:", response.error);
      toast.dismiss();
      toast.error(response.error || "Failed to load cart");
    }
  } catch (error) {
    console.error("Error while fetching cart data:", error);
    
    if (isAuthError(error, null)) {
      handleAuthFailure();
    } else {
      toast.dismiss();
      toast.error("Failed to load cart data");
    }
  } finally {
    setLoading(false);
    console.log("Loading state set to false.");
  }
};

  const handleQuantityChange = async (itemId, productId, action) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    
    setLoadingItems((prev) => ({ ...prev, [itemId]: true }));

    // Optimistic update: Update local state immediately before API response
    setCartData((prevCartData) => {
      const updatedItems = prevCartData.items.map((item) => {
        if (item._id === itemId) {
          const newQuantity =
            action === "increment" ? item.quantity + 1 : item.quantity - 1;

          return {
            ...item,
            quantity: newQuantity,
          };
        }
        return item;
      });

      // Calculate new cart totals
      const newSubtotal =
        prevCartData.subtotal +
        (action === "increment"
          ? updatedItems.find((item) => item._id === itemId).productId.price
          : -updatedItems.find((item) => item._id === itemId).productId.price);

      const newTotalPrice = newSubtotal - prevCartData.discount;

      return {
        ...prevCartData,
        items: updatedItems,
        subtotal: newSubtotal,
        totalPrice: newTotalPrice,
      };
    });

   
    const response = await updateCartQuantityApi(
      userId,
      productId,
      itemId,
      action
    );

  
    setLoadingItems((prev) => ({ ...prev, [itemId]: false }));

    if (response.success) {
      fetchCart();
    } else {
      fetchCart();
      console.error(response.error);
      toast.dismiss();
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setRemoveLoading((prev) => ({ ...prev, [itemId]: true }));

    const response = await removeProductFromCartApi(userId, itemId);

    setRemoveLoading((prev) => ({ ...prev, [itemId]: false }));

    if (response.success) {
      toast.dismiss();
      toast.success("Item removed from cart");
      fetchCart(); 
    } else {
      console.error(response.error);
      toast.dismiss();
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    if (!cartData?._id) {
      toast.dismiss();
      toast.error("Cart ID is missing. Please add items to your cart first.");
      return;
    }

    setCheckoutLoading(true);

    try {
      const response = await checkoutCreateApi(cartData._id);

      if (response?.success) {
        toast.dismiss();
        toast.success("Checkout successful!");
        navigate(`/address/${response.data.checkout._id}`);
      } else {
        throw new Error(
          response?.error || "Checkout failed. Please try again."
        );
      }
    } catch (error) {
      toast.dismiss();
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div>
      <Container fluid className="cart-container ">
        <Row className="no-gutters">
          {/* Left Column - Cart Items */}
          <Col xs={12} md={7} className="cart-left-column mb-4 mb-md-0">
            {loading ? (
              <Skeleton count={3} height={140} className="mb-3" />
            ) : cartData?.items?.length > 0 ? (
              cartData?.items?.map((item) => (
                <Card
                  className="cart-item mb-4 p-3 border-0 shadow-sm"
                  key={item._id}
                >
                  <Row className="align-items-center">
                    <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                      <img
                        src={
                          item?.productId?.images?.[0]
                            ? `${BASE_URL}/uploads/${item.productId.images[0]}`
                            : "/placeholder.jpg"
                        }
                        alt={item?.productId?.name || "Product Image"}
                        className="cart-image img-fluid rounded"
                      />
                    </Col>
                    <Col xs={12} sm={8}>
                      <Card.Body className="p-0">
                        <Card.Title className="cart-title">
                          {item?.productId?.name || "Product "}
                        </Card.Title>
                        <Card.Text>
                          <p className="color-size">Color: {item.color}</p>
                          <p className="color-size">Size: {item.size}</p>

                          <div className="cart-quantity">
                            <div className="quantity-wrapper flex items-center space-x-2">
                              {/* Decrement button with improved loading state */}
                              <button
                                className={`quantity-btn minus w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                                  isLoading
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "hover:bg-gray-100 active:bg-gray-200"
                                }`}
                                onClick={() =>
                                  handleQuantityChange(
                                    item._id,
                                    item.productId._id,
                                    "decrement"
                                  )
                                }
                                disabled={item.quantity <= 1 || isLoading}
                                aria-label="Decrease quantity"
                              >
                                <Minus
                                  className={`w-4 h-4 ${
                                    isLoading
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                />
                              </button>

                              {/* Quantity display with subtle loading indicator */}
                              <div className="relative">
                                <span
                                  className={`quantity-number font-medium ${
                                    isLoading
                                      ? "text-gray-400"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {item.quantity}
                                </span>
                                {isLoading && (
                                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200 overflow-hidden">
                                    <div className="loading-bar h-full bg-blue-500 animate-pulse"></div>
                                  </div>
                                )}
                              </div>

                              {/* Increment button with improved loading state */}
                              <button
                                className={`quantity-btn plus w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                                  isLoading
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "hover:bg-gray-100 active:bg-gray-200"
                                }`}
                                onClick={() =>
                                  handleQuantityChange(
                                    item._id,
                                    item.productId._id,
                                    "increment"
                                  )
                                }
                                disabled={isLoading}
                                aria-label="Increase quantity"
                              >
                                <Plus
                                  className={`w-4 h-4 ${
                                    isLoading
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          <p className="cart-delivery text-sm text-gray-500 mt-2">
                            Delivery: Free Delivery
                          </p>

                          {/* Remove Button with improved loading state */}
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            disabled={removeLoading || isLoading}
                            className={`btn p-2 rounded-full transition-all duration-200 ${
                              removeLoading
                                ? "bg-red-50 cursor-not-allowed"
                                : "hover:bg-red-50"
                            }`}
                            aria-label="Remove item"
                          >
                            <Trash2
                              className={`w-5 h-5 ${
                                removeLoading ? "text-red-300" : "text-red-500"
                              }`}
                            />
                            {removeLoading && (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
                              </span>
                            )}
                          </button>
                        </Card.Text>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))
            ) : (
              // Show "No Products" Message and Continue Shopping Button
              <div className="empty-cart-container">
                <div className="icon-container-empty">
                  <div className="icon-background" />
                  <ShoppingBag className="shopping-icon" />
                </div>

                <h2 className="empty-cart-title">Your Cart is Empty</h2>

                <p className="empty-cart-description">
                  Looks like you haven't added anything to your cart yet.
                  Discover our amazing products and start shopping!
                </p>

                <button
                  onClick={() => (window.location.href = "/")}
                  className="shopping-button"
                >
                  <ShoppingBag className="button-icon" />
                  <span>Continue Shopping</span>
                  <div className="button-overlay" />
                </button>

                <div className="decorative-blobs">
                  <div className="blob blob-1" />
                  <div className="blob blob-2" />
                  <div className="blob blob-3" />
                </div>
              </div>
            )}
          </Col>

          {/* Right Column - Checkout Summary */}
          <Col xs={12} md={5} className="cart-right-column">
            <Card className="cart-checkout p-3 shadow">
              <Card.Body>
                <Card.Text className="mt-3">
                  {loading ? (
                    <Skeleton height={20} width="100%" count={5} />
                  ) : (
                    <>
                      <div className="d-flex justify-content-between">
                        <p className="cart-check-total">Total Items:</p>
                        <p className="text-end cart-check-total">
                          {cartData?.items?.length}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="cart-check-total">Subtotal:</p>
                        <p className="text-end cart-check-total">
                          ₹{cartData?.subtotal}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="cart-check-total">Discount:</p>
                        <p className="text-end points">₹{cartData?.discount}</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="cart-check-total">Total Price:</p>
                        <p className="text-end cart-check-total">
                          ₹{cartData?.totalPrice}
                        </p>
                      </div>
                    </>
                  )}
                </Card.Text>

                <button
                  className="w-100 mb-2 checkout-button"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Checkout"
                  )}
                </button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Cart;
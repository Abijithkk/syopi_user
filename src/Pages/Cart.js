import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Cart.css";
import Recommend from "../components/Recommend";
import {
  checkoutCreateApi,
  getUserCartApi,
  removeProductFromCartApi,
  updateCartQuantityApi,
} from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState([]);
  const [loadingItems, setLoadingItems] = useState({});
  const [removeLoading, setRemoveLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false); // Initially false
  const isLoading = loadingItems[cartData._id];

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setLoading(false);
      return;
    }

    const response = await getUserCartApi(userId);
    console.log("cart", response);

    if (response.success) {
      setCartData(response.data);
    } else {
      console.error(response.error);
    }
    setLoading(false);
  };

  const handleQuantityChange = async (itemId, productId, action) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // Set loading state for this item
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

      // Recalculate total price (assuming discount doesn't change)
      const newTotalPrice = newSubtotal - prevCartData.discount;

      return {
        ...prevCartData,
        items: updatedItems,
        subtotal: newSubtotal,
        totalPrice: newTotalPrice,
      };
    });

    // Make API call in background
    const response = await updateCartQuantityApi(
      userId,
      productId,
      itemId,
      action
    );

    // Remove loading state after API response
    setLoadingItems((prev) => ({ ...prev, [itemId]: false }));

    if (response.success) {
      // Optionally fetch cart data to ensure sync with server
      // You could do this less frequently, not on every quantity change
      fetchCart();
    } else {
      // Revert the optimistic update if the API call fails
      fetchCart();
      console.error(response.error);
      // You might want to show an error message to the user here
    }
  };
  const handleRemoveItem = async (itemId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // Set loading state for this item
    setRemoveLoading((prev) => ({ ...prev, [itemId]: true }));

    const response = await removeProductFromCartApi(userId, itemId);

    // Remove loading state after API response
    setRemoveLoading((prev) => ({ ...prev, [itemId]: false }));

    if (response.success) {
      fetchCart(); // Refresh cart after removing item
    } else {
      console.error(response.error);
    }
  };
  const handleCheckout = async () => {
    if (!cartData?._id) {
      toast.error("Cart ID is missing. Please add items to your cart first.");
      return;
    }

    setCheckoutLoading(true); // Start checkout-specific loading

    try {
      const response = await checkoutCreateApi(cartData._id);

      if (response?.success) {
        toast.success("Checkout successful!");
        navigate(`/address/${response.data.checkout._id}`);
      } else {
        throw new Error(
          response?.error || "Checkout failed. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setCheckoutLoading(false); // Stop checkout loading
    }
  };

  return (
    <div>
      <Container fluid className="cart-container my-5">
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
                <div className="cart-points-info text-center bg-light p-3">
                  <p className="m-0 cart-points">
                    1 Point = 1 Rupee: For example, if you have 40 points, you
                    can use them as 40 rupees on your purchase.
                  </p>
                  <button className="checkout-button1 mt-2">
                    Claim with Syopi points
                  </button>
                </div>

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

      {/* Separate loading state for Recommend */}
      {loading ? (
        <Container fluid className="recommend-container my-5">
          <Row>
            {[1, 2, 3, 4].map((_, index) => (
              <Col key={index} xs={6} md={3} className="mb-3">
                <Skeleton height={200} />
              </Col>
            ))}
          </Row>
        </Container>
      ) : (
        <Recommend />
      )}
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default Cart;

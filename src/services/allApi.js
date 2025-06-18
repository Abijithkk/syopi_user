import { BASE_URL } from "./baseUrl";
import { commonApi } from "./commonApi";

export const userLoginApi = async (loginData) => {
  const url = `${BASE_URL}/user/auth/login`;
  return await commonApi("POST", url, loginData);
};

export const userRegisterpApi = async (RegisterData) => {
  const url = `${BASE_URL}/user/auth/register`;
  return await commonApi("POST", url, RegisterData);
};

// Resend OTP for Registration
export const resendOtpApi = async (userData) => {
  const url = `${BASE_URL}/user/auth/register/resend-otp`;
  return await commonApi("POST", url, userData);
};

// Verify OTP for Registration
export const verifyOtpApi = async (verificationData) => {
  const url = `${BASE_URL}/user/auth/register/verify-otp`;
  return await commonApi("POST", url, verificationData);
};

// Send Forgot Password OTP (Phone)
export const sendForgotPasswordOtpApi = async (phoneData) => {
  const url = `${BASE_URL}/user/auth/forgot-password/send-otp`;
  return await commonApi("POST", url, phoneData);
};

// Verify Forgot Password OTP (Phone)
export const verifyForgotPasswordOtpApi = async (otpData) => {
  const url = `${BASE_URL}/user/auth/forgot-password/verify-otp`;
  return await commonApi("POST", url, otpData);
};

// Reset Password after Verification
export const resetPasswordApi = async (passwordData) => {
  const url = `${BASE_URL}/user/auth/forgot-password/reset-password`;
  return await commonApi("PATCH", url, passwordData);
};

// Google Login (Web)
export const googleLoginApi = () => {
  return `${BASE_URL}/user/auth/google`;
};



// Google Login for Android
export const androidGoogleLoginApi = async (idTokenData) => {
  const url = `${BASE_URL}/user/auth/google/android`;
  return await commonApi("POST", url, idTokenData);
};

// Apple Login (Web)
export const appleLoginApi = () => {
  return `${BASE_URL}/user/auth/apple`;
};

// Handle Apple Login Callback
export const appleLoginCallbackApi = async (appleAuthData) => {
  const url = `${BASE_URL}/user/auth/apple/callback`;
  return await commonApi("POST", url, appleAuthData);
};
// View Profile API
export const getProfileApi = async () => {
  const url = `${BASE_URL}/user/profile/view`;

  const accessToken = localStorage.getItem("accessuserToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error fetching profile" };
  }
};
export const deleteUserProfileApi = async () => {
  const url = `${BASE_URL}/user/profile/delete`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting user profile",
    };
  }
};

export const getBrandApi = async () => {
  const url = `${BASE_URL}/user/brand/view`;
  try {
    const response = await commonApi("GET", url);
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error fetching brand" };
  }
};
// Update Profile API
export const updateProfileApi = async (profileData) => {
  const url = `${BASE_URL}/user/profile/update`;

  const accessToken = localStorage.getItem("accessuserToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, profileData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating profile" };
  }
};
export const getNotificationsApi = async () => {
  const url = `${BASE_URL}/user/notification/view`;

  const accessToken = localStorage.getItem("accessuserToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error fetching notifications" };
  }
};

export const verifyotpApi = async (otp) => {
  const url = `${BASE_URL}/user/auth/register/verify-otp`;
  return await commonApi("POST", url, otp);
};

export const getCategoriesApi = async () => {
  const url = `${BASE_URL}/user/categories/view`;

  try {
    const response = await commonApi("GET", url);
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching categories",
    };
  }
};
export const getSubcategoriesByCategoryIdApi = async (categoryId) => {
  const url = `${BASE_URL}/user/Subcategories/view/subcategory/${categoryId}`;

  try {
    const response = await commonApi("GET", url);
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching subcategories",
    };
  }
};

export const getUserHomePageApi = async () => {
  const url = `${BASE_URL}/user/home`;

  try {
    const response = await commonApi("GET", url);
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching home page data",
    };
  }
};

export const getProductApi = async (params = "") => {
  const url = `${BASE_URL}/user/Products/view${params ? `?${params}` : ""}`;

  try {
    const response = await commonApi("GET", url);
    return response;
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: error.message || "Error fetching Products",
      message: "Failed to load products. Please try again.",
    };
  }
};

export const getProductsWithSort = async (options = {}) => {
  const {
    search = null,
    productType = null,
    subcategory = null,
    category = null,
    minPrice = null,
    maxPrice = null,
    discountMin = null,
    sort = null,
    sortField = "createdAt",
    newArrivals = null,
    brand = null,        // ADD: Brand parameter
    minRating = null,    // ADD: Rating parameter
    page = 1,
    limit = 12
  } = options;

  const params = new URLSearchParams();
  
  if (search) params.append("search", search);
  
  if (productType) {
    if (Array.isArray(productType) && productType.length > 0) {
      params.append("productType", productType.join(","));
    } else if (typeof productType === "string") {
      params.append("productType", productType);
    }
  }
  
  if (subcategory) params.append("subcategory", subcategory);
  if (category) params.append("category", category);
  if (minPrice !== null) params.append("minPrice", minPrice);
  if (maxPrice !== null) params.append("maxPrice", maxPrice);
  if (discountMin !== null) params.append("discountMin", discountMin);
  if (newArrivals) params.append("newArrivals", "true");
  
  // ADD: Brand filter
  if (brand) {
    params.append("brand", brand);
  }
  
  // ADD: Rating filter
  if (minRating !== null) {
    params.append("minRating", minRating);
  }
  
  // ADD: Pagination
  params.append("page", page);
  params.append("limit", limit);

  if (sort) {
    params.append("sort", sort);
    params.append("sortField", sortField);
  }

  return getProductApi(params.toString());
};



export const getDeliveryDateApi = async (pincode) => {
  const url = `${BASE_URL}/user/Products/expected_date?pincode=${pincode}`;
  try {
    const response = await commonApi("GET", url);
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching delivery date",
    };
  }
};

export const searchProductApi = async (searchQuery) => {
  const url = `${BASE_URL}/user/Products/view?search=${encodeURIComponent(
    searchQuery
  )}`;

  try {
    const response = await commonApi("GET", url);
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error searching Products",
    };
  }
};

export const getProductByIdApi = async (productId) => {
  const url = `${BASE_URL}/user/Products/view/${productId}`;

  try {
    const response = await commonApi("GET", url);
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching product by ID",
    };
  }
};

export const getSimilarProductApi = async (productId) => {
  const url = `${BASE_URL}/user/Products/similar/${productId}`;

  try {
    const response = await commonApi("GET", url);
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching Similar product",
    };
  }
};

export const addWishlistApi = async (productId) => {
  const url = `${BASE_URL}/user/wishlist/add`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessuserToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // Prepare the request body
  const body = { productId: productId };

  try {
    const response = await commonApi("POST", url, body, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error adding to wishlist",
    };
  }
};
export const removefromWishlist = async (productId) => {
  const url = `${BASE_URL}/user/wishlist/delete`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  const body = {
    productId,
  };

  try {
    const response = await commonApi("DELETE", url, body, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error removing Wishlist",
    };
  }
};

export const getWishlistApi = async () => {
  const url = `${BASE_URL}/user/wishlist/get`;
  const accessToken = localStorage.getItem("accessuserToken");

  
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching wishlist",
    };
  }
};

export const addToCartApi = async (
  userId,
  productId,
  quantity,
  color,
  colorName,
  size
) => {
  const url = `${BASE_URL}/user/cart/add`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // Ensure correct request body structure
  const body = {
    userId,
    productId,
    quantity,
    color,
    colorName,
    size,
  };

  try {
    const response = await commonApi("POST", url, body, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error adding to cart" };
  }
};

export const getUserCartApi = async (userId) => {
  const url = `${BASE_URL}/user/cart/view/${userId}`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching cart details",
    };
  }
};

export const updateCartQuantityApi = async (
  userId,
  productId,
  itemId,
  action
) => {
  const url = `${BASE_URL}/user/cart/update/quantity`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  const body = {
    userId,
    productId,
    itemId,
    action, // "increment" or "decrement"
  };

  try {
    const response = await commonApi("PATCH", url, body, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error updating cart quantity",
    };
  }
};

export const removeProductFromCartApi = async (userId, itemId) => {
  const url = `${BASE_URL}/user/cart/remove/product`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  const body = {
    userId,
    itemId,
  };

  try {
    const response = await commonApi("DELETE", url, body, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error removing product from cart",
    };
  }
};

export const checkoutCreateApi = async (cartId) => {
  const url = `${BASE_URL}/user/checkout/create`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  const body = { cartId };

  try {
    const response = await commonApi("POST", url, body, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error creating checkout",
    };
  }
};

export const getCheckoutByIdApi = async (checkoutId) => {
  const url = `${BASE_URL}/user/checkout/view/${checkoutId}`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching checkout details",
    };
  }
};

export const deleteCheckoutByIdApi = async (checkoutId) => {
  const url = `${BASE_URL}/user/checkout/delete/${checkoutId}`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting checkout",
    };
  }
};


// Apply coupon to checkout
export const applyCouponApi = async (checkoutId, couponCode) => {
  const url = `${BASE_URL}/user/checkout/apply/coupon`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  const body = { checkoutId, couponCode };

  try {
    const response = await commonApi("POST", url, body, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error applying coupon" };
  }
};

// Get available coupons for a checkout
export const getAvailableCouponsApi = async (checkoutId) => {
  const url = `${BASE_URL}/user/checkout/get/${checkoutId}/coupons`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching available coupons",
    };
  }
};

export const applyCoinsApi = async (checkoutId) => {
  const url = `${BASE_URL}/user/checkout/apply/coin`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  const body = { checkoutId };

  try {
    const response = await commonApi("POST", url, body, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error applying coins" };
  }
};

export const buyNowCheckoutApi = async (productData) => {
  const url = `${BASE_URL}/user/checkout/buy-now`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, productData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error creating buy now checkout",
    };
  }
};


export const addReviewApi = async (reviewData) => {
  const url = `${BASE_URL}/user/review/add`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, reviewData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error adding review",
    };
  }
};


export const addAddressApi = async (addressData) => {
  const url = `${BASE_URL}/user/address/add`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, addressData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error adding address" };
  }
};

export const getAddressApi = async () => {
  const url = `${BASE_URL}/user/address/view`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching addresses",
    };
  }
};
export const updateAddressApi = async (addressId, updatedData) => {
  const url = `${BASE_URL}/user/address/update/${addressId}`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, updatedData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error updating address",
    };
  }
};
export const deleteAddressApi = async (addressId) => {
  const url = `${BASE_URL}/user/address/delete/${addressId}`;

  const accessToken = localStorage.getItem("accessuserToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting address",
    };
  }
};

// Add this to your allApi.js file
export const placeOrderApi = async (orderData) => {
  const url = `${BASE_URL}/user/order/create`;

  const accessToken = localStorage.getItem("accessuserToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, orderData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error placing order" };
  }
};

export const getUserOrdersApi = async (params = {}) => {
  // Build query string for pagination
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);

  const url = `${BASE_URL}/user/order/view?${queryParams.toString()}`;

  const accessToken = localStorage.getItem("accessuserToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error fetching orders" };
  }
};

export const getSingleOrderApi = async (orderId) => {
  const url = `${BASE_URL}/user/order/view/${orderId}`;

  const accessToken = localStorage.getItem("accessuserToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching order details",
    };
  }
};

export const requestOrderReturnApi = async (orderId, returnData) => {
  const url = `${BASE_URL}/user/order/return/${orderId}`;

  const accessToken = localStorage.getItem("accessuserToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, returnData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error requesting order return",
    };
  }
};

export const cancelOrderApi = async (orderId, cancelData) => {
  const url = `${BASE_URL}/user/order/cancel/${orderId}`;

  const accessToken = localStorage.getItem("accessuserToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, cancelData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error canceling order" };
  }
};

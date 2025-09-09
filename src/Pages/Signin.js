import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import signimg from "../images/Landing.jpeg";
import "./signin.css";
import { googleLoginApi, userLoginOrRegisterApi, userLoginResendOtpApi, userLoginVerifyOtpApi } from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";

function Signin() {
  const [phone, setPhone] = useState("");
  const [referralId, setReferralId] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtpField, setShowOtpField] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const otpInputRefs = useRef([]);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const googleCode = urlParams.get('code');
      const provider = urlParams.get('provider');
      const state = urlParams.get('state');
      
      if (googleCode && (!provider || provider === 'google' || state === 'google')) {
        setGoogleLoading(true);
        const loadingToast = toast.loading("Completing Google sign-in...");
        
        try {
          const response = await fetch(`${BASE_URL}/user/auth/google/callback?code=${encodeURIComponent(googleCode)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Expected JSON but received: ${text.substring(0, 100)}...`);
          }
          
          const data = await response.json();

          if (response.ok && data && data.token) {
            localStorage.setItem("userId", data.user.userId || data.user._id || data.user.id);
            localStorage.setItem("accessuserToken", data.token || data.accessToken);
            localStorage.setItem("username", data.user.name || data.user.username);
            localStorage.setItem("role", data.user.role || "user");
            
            toast.success("Google sign-in successful!");
            
            setTimeout(() => {
              navigate("/");
            }, 1000);
          } else {
            toast.error(data.message || "Failed to complete Google sign-in");
          }
        } catch (error) {
          console.error("Google Callback Error:", error);
          toast.error(error.message || "Failed to authenticate with Google");
        } finally {
          toast.dismiss(loadingToast);
          setGoogleLoading(false);
          
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    handleOAuthCallback();
  }, [location, navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (resendDisabled) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, resendDisabled]);

  // Focus on first OTP input when OTP field is shown
  useEffect(() => {
    if (showOtpField && otpInputRefs.current[0]) {
      otpInputRefs.current[0].focus();
    }
  }, [showOtpField]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus to next input if current input is filled
    if (value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').slice(0, 6);
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
      
      // Focus on the last input field after pasting
      if (newOtp.length < 6) {
        otpInputRefs.current[newOtp.length].focus();
      } else {
        otpInputRefs.current[5].focus();
      }
    }
  };

const handleLogin = async (e) => {
  e.preventDefault();

  if (!phone) {
    toast.error("Please enter Phone number");
    return;
  }
  
  setLoading(true);
  const loadingToast = toast.loading("Sending OTP to your phone...");

  try {
    const requestData = { phone };
    
    // Only add referralId if it's a non-empty string
    if (referralId && referralId.trim() !== "") {
      requestData.referredBy = referralId.trim();
    }
    
    const response = await userLoginOrRegisterApi(requestData);
    
    if (response.success && response.status === 200) {
      setSessionId(response.data.sessionId || "TEST_SESSION");
      setShowOtpField(true);
      setResendDisabled(true);
      setCountdown(30); // 30 seconds countdown
      toast.success("OTP sent successfully!");
    } else {
      // Corrected error message extraction based on the response structure
      const errorMessage = response.error?.message || 
                          response.data?.message || 
                          "Failed to send OTP!";
      toast.error(errorMessage);
      console.log("API Response:", response);
    }
  } catch (error) {
    console.error("Login Error:", error);
    // More detailed error logging
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      toast.error(error.response.data?.message || "Something went wrong. Please try again.");
    } else {
      toast.error("Network error. Please check your connection.");
    }
  } finally {
    toast.dismiss(loadingToast);
    setLoading(false);
  }
};

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    
    setOtpLoading(true);
    const loadingToast = toast.loading("Verifying OTP...");

    try {
      const requestData = {
        phone,
        otp: otpString,
        sessionId: sessionId || "TEST_SESSION" 
      };
      
      // Add referralId to the request if provided
      if (referralId) {
        requestData.referredBy = referralId;
      }
      
      const response = await userLoginVerifyOtpApi(requestData);
      
      if (response.success && response.status === 200) {
        const { user } = response.data;
        localStorage.setItem("userId", user?.userId || user?._id || user?.id);
        localStorage.setItem("accessuserToken", response.data.accessToken);
        localStorage.setItem("username", user?.name || user?.username);
        localStorage.setItem("role", user?.role || "user");
        
        toast.success("Login successful!");
        
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        const errorMessage = response.data?.error?.message || response.data?.message || "OTP verification failed!";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      toast.dismiss(loadingToast);
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!phone) {
      toast.error("Phone number is required");
      return;
    }
    
    setResendLoading(true);
    setResendDisabled(true);
    setCountdown(30); // Reset countdown
    
    try {
      const requestData = { phone };
      // Add referralId to the request if provided
      if (referralId) {
        requestData.referredBy = referralId;
      }
      
      const response = await userLoginResendOtpApi(requestData);
      
      if (response.success && response.status === 200) {
        toast.success("New OTP sent successfully!");
      } else {
        const errorMessage = response.data?.error?.message || response.data?.message || "Failed to resend OTP!";
        toast.error(errorMessage);
        setResendDisabled(false);
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
      setResendDisabled(false);
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    window.location.href = googleLoginApi();
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        <h1>Welcome Back 👋</h1>
        <p>Get ready to dress your little ones in fashion-forward outfits.</p>

        <form className="signin-form" onSubmit={showOtpField ? handleVerifyOtp : handleLogin}>
          <label>Phone Number</label>
          <input
            type="text"
            placeholder="Enter your Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={showOtpField}
          />

          {!showOtpField && (
            <>
              <label>Referral ID (Optional)</label>
              <input
                type="text"
                placeholder="Enter referral code if you have one"
                value={referralId}
                onChange={(e) => setReferralId(e.target.value)}
              />
            </>
          )}

          {showOtpField && (
            <>
              <label>OTP</label>
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    className="otp-input"
                  />
                ))}
              </div>
              <div className="resend-otp">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendDisabled || resendLoading}
                >
                  {resendLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    "Resend OTP"
                  )}
                </button>
                {resendDisabled && (
                  <span className="countdown">in {countdown}s</span>
                )}
              </div>
            </>
          )}

          <button type="submit" className="signin-btn" disabled={loading || otpLoading}>
            {loading || otpLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : showOtpField ? (
              "Verify OTP"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {!showOtpField && (
          <div className="signin-alternatives">
            <button className="or">Or</button>
            <button 
              className="social-btn google"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <span className="icon google-icon"></span>
              <span className="textt">
                {googleLoading ? 
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 
                  "Sign in with Google"
                }
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="signin-right">
        <img src={signimg} alt="Sign In" />
      </div>
      
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#EF4444',
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: '#333',
            },
          },
        }}
      />
    </div>
  );
}

export default Signin;
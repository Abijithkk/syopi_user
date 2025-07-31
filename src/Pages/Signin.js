import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import signimg from "../images/Landing.jpeg";
import "./signin.css";
import { userLoginApi, googleLoginApi, appleLoginApi, userLoginVerifyApi, resendLoginOtpApi } from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";

function Signin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const googleCode = urlParams.get('code');
      const appleCode = urlParams.get('code');
      const provider = urlParams.get('provider');
      const state = urlParams.get('state');
      
      if (googleCode && (!provider || provider === 'google' || state === 'google')) {
        setGoogleLoading(true);
        const loadingToast = toast.loading("Completing Google sign-in...");
        
        try {
          const response = await fetch(`${BASE_URL}/user/auth/google/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: googleCode })
          });
          
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
          toast.error("Failed to authenticate with Google");
        } finally {
          toast.dismiss(loadingToast);
          setGoogleLoading(false);
          
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
      
      if (appleCode && (provider === 'apple' || state === 'apple')) {
        setAppleLoading(true);
        const loadingToast = toast.loading("Completing Apple sign-in...");
        
        try {
          const response = await fetch(`${BASE_URL}/user/auth/apple/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: appleCode })
          });
          
          const data = await response.json();
          
          if (response.ok && data && data.token) {
            localStorage.setItem("userId", data.user.userId || data.user._id || data.user.id);
            localStorage.setItem("accessuserToken", data.token || data.accessToken);
            localStorage.setItem("username", data.user.name || data.user.username);
            localStorage.setItem("role", data.user.role || "user");
            
            toast.success("Apple sign-in successful!");
            
            setTimeout(() => {
              navigate("/");
            }, 1000);
          } else {
            toast.error(data.message || "Failed to complete Apple sign-in");
          }
        } catch (error) {
          console.error("Apple Callback Error:", error);
          toast.error("Failed to authenticate with Apple");
        } finally {
          toast.dismiss(loadingToast);
          setAppleLoading(false);
          
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

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!phone) {
      toast.error("Please enter Phone number");
      return;
    }
    
    setLoading(true);
    const loadingToast = toast.loading("Sending OTP to your phone...");

    try {
      const response = await userLoginApi({ phone });
      
      if (response.success && response.status === 200) {
        setSessionId(response.data.sessionId);
        setShowOtpField(true);
        setResendDisabled(true);
        setCountdown(30); // 30 seconds countdown
        toast.success("OTP sent successfully!");
      } else {
        const errorMessage = response.data?.error?.message || response.data?.message || "Failed to send OTP!";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    
    setOtpLoading(true);
    const loadingToast = toast.loading("Verifying OTP...");

    try {
      const response = await userLoginVerifyApi({
        phone,
        otp,
        sessionId: sessionId || "TEST_SESSION" 
      });
      
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
      const response = await resendLoginOtpApi({ phone });
      
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

  const handleAppleSignIn = () => {
    setAppleLoading(true);
    window.location.href = appleLoginApi();
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

          {showOtpField && (
            <>
              <label>OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
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
            <button 
              className="social-btn apple"
              onClick={handleAppleSignIn}
              disabled={appleLoading}
            >
              <span className="icon apple-icon"></span>
              <span className="textt">
                {appleLoading ? 
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 
                  "Sign in with Apple"
                }
              </span>
            </button>
          </div>
        )}

        <p className="signup-text">
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </p>
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
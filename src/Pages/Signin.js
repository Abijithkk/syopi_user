import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import signimg from "../images/Landing.jpeg";
import "./signin.css";
import { userLoginApi, googleLoginApi } from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";

function Signin() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      
      if (code) {
        setGoogleLoading(true);
        const loadingToast = toast.loading("Completing Google sign-in...");
        
        try {
          const response = await fetch(`${BASE_URL}/user/auth/google/callback?code=` + code, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          const data = await response.json();
          
          if (data && data.token) {
            // Store authentication data
            localStorage.setItem("userId", data.user.userId);
            localStorage.setItem("accessuserToken", data.token);
            localStorage.setItem("username", data.user.name);
            localStorage.setItem("email", data.user.email);
            
            toast.success("Google sign-in successful!");
            // Use a setTimeout to ensure the toast is visible before navigation
            setTimeout(() => {
              navigate("/");
            }, 1000);
          } else {
            toast.error("Failed to complete Google sign-in");
          }
        } catch (error) {
          console.error("Google Callback Error:", error);
          toast.error(error.response?.data?.message || "Failed to authenticate with Google");
        } finally {
          toast.dismiss(loadingToast);
          setGoogleLoading(false);
          
          // Clear the URL to remove the code
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    handleGoogleCallback();
  }, [location, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!emailOrPhone || !password) {
      toast.error("Please enter email/phone and password");
      return;
    }
    
    setLoading(true);
    const loadingToast = toast.loading("Signing you in...");

    try {
      const response = await userLoginApi({ emailOrPhone, password });
      
      console.log("Login Response:", response);
      
      // Check if login was successful based on the response structure you showed
      if (response.success && response.status === 200) {
        // Extract data from the response
        const { accessToken, refreshToken, user } = response.data;
        
        // Store tokens and user data in localStorage
        localStorage.setItem("userId", user?.id || user?.userId);
        localStorage.setItem("accessuserToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("username", user?.name || user?.username);
        localStorage.setItem("email", user?.email);
        
        toast.success("Login successful!");
        
        // Use setTimeout to ensure the toast is visible before navigation
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        // Show error message from response
        const errorMessage = response.data?.error?.message || response.data?.message || "Login failed!";
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
  
  // Handle Google Sign-In
  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    
    // Redirect to your backend's Google OAuth route
    // This should be the URL returned by googleLoginApi()
    window.location.href = googleLoginApi();
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        <h1>Welcome Back 👋</h1>
        <p>Get ready to dress your little ones in fashion-forward outfits.</p>

        <form className="signin-form" onSubmit={handleLogin}>
          <label>Email or Phone Number</label>
          <input
            type="text"
            placeholder="Enter your Email or Phone number"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />

          <label>Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="toggle-password right-icon" onClick={togglePasswordVisibility}>
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          <div className="signin-links">
            <a href="/forget">Forgot Password?</a>
          </div>

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Sign In"}
          </button>
        </form>

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
          <button className="social-btn facebook">
            <span className="icon facebook-icon"></span>
            <span className="textt">Sign in with Facebook</span>
          </button>
          <button className="social-btn apple">
            <span className="icon apple-icon"></span>
            <span className="textt">Sign in with Apple</span>
          </button>
        </div>

        <p className="signup-text">
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>

      <div className="signin-right">
        <img src={signimg} alt="Sign In" />
      </div>
      
      {/* React Hot Toast container with improved configuration */}
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
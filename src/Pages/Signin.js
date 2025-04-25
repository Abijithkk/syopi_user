import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signimg from "../images/Landing.jpeg";
import "./signin.css";
import { userLoginApi } from "../services/allApi";
import { toast, ToastContainer } from "react-toastify";

function Signin() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

    try {
      const response = await userLoginApi({ emailOrPhone, password });
  
      console.log("Login Response:", response); // ✅ Debugging
  
      if (response.status === 200 && response.success) {
        toast.success("Login successful!");
        localStorage.setItem("userId", response.data.user.userId);
        localStorage.setItem("accessuserToken", response.data.accessToken);
        localStorage.setItem("refreshuserToken", response.data.refreshToken);
        navigate("/");
      } else {
        // ✅ Show error message from response
        const errorMessage = response.error?.message || response.message || "Login failed!";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Login Error:", error); // ✅ Debugging
  
      toast.error("Something went wrong. Please try again.");
    }
    finally{
      setLoading(false);

    }
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

          <button type="submit" className="signin-btn" disabled={loading}>  {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Sign In"}
          </button>
        </form>

        <div className="signin-alternatives">
          <button className="or">Or</button>
          <button className="social-btn google">
            <span className="icon google-icon"></span>
            <span className="textt">Sign in with Google</span>
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
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default Signin;

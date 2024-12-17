import React, { useState } from 'react';
import signimg from '../images/Landing.jpeg';
import './signin.css';

function Signin() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  return (
    <div className="signin-container">
      <div className="signin-left">
        <h1>Welcome Back 👋</h1>
        <p>Get ready to dress your little ones in fashion-forward outfits.</p>

        <form className="signin-form">
          <label>Email or Phone Number</label>
          <input type="text" placeholder="Enter your Email or Phone number" />

          <label>Password</label>
          <div className="password-container">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Enter your Password" 
            />
            <span 
              className="toggle-password right-icon" 
              onClick={togglePasswordVisibility}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>

          <div className="signin-links">
            <a href="/forget">Forgot Password?</a>
          </div>

          <button type="submit" className="signin-btn">Sign In</button>
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
          Don&apos;t you have an account? <a href="/signup">Sign up</a>
        </p>
      </div>

      <div className="signin-right">
        <img src={signimg} alt="Sign In" />
      </div>
    </div>
  );
}

export default Signin;
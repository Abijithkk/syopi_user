import React, { useState } from 'react';
import signimg from '../images/Landing.jpeg';
import './signup.css';

function Signup() {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [code, setCode] = useState(Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSignUpClick = (event) => {
    event.preventDefault();
    setIsSignedUp(true);
  };

  const handleCodeChange = (e, index) => {
    const newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

 
  const isCodeComplete = code.every((digit) => digit !== '');

  return (
    <div className="signin-container">
      <div className="signin-left">
        {!isSignedUp ? (
          <>
            <h1>Let’s sign you up</h1>
            <p>Get ready to dress your little ones in fashion-forward outfits</p>

            <form className="signin-form" onSubmit={handleSignUpClick}>
              <label>Name</label>
              <input type="text" placeholder="Enter your name" />
              <label>Email or Phone Number</label>
              <input type="text" placeholder="Enter your Email or Phone number" />
              <label>Referral Code</label>
              <input type="text" placeholder="E7635142194" />
              <button type="submit" className="signin-btn mt-3">Sign Up</button>
            </form>

            <p className="signup-text">
              Already have an account? <a href="/signin">Sign in</a>
            </p>
          </>
        ) : (
          <>
            {isCodeComplete ? (
              <div className="signin-left">
                <h1>Set a Password</h1>
                <p>Please set a password for your account</p>
              
                <form className="signin-form">
                <label>Enter Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                  />
                  <label>Re-enter Password</label>
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
                  <button type="submit" className="signin-btn mt-3">Set Password</button>
                </form>
              </div>
            ) : (
              <>
                <h1>We just sent you an SMS</h1>
                <p>Enter the security code we sent to</p>
                <p className="phone-number">+91 876538726</p>
                <div className="code-input-container">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="code-input"
                      value={code[index]}
                      onChange={(e) => handleCodeChange(e, index)}
                    />
                  ))}
                </div>
                <p>
                  Didn’t receive a code? <a href="/">Resend Code</a>
                </p>
              </>
            )}
          </>
        )}
      </div>

      <div className="signin-right">
        <img src={signimg} alt="Sign In" />
      </div>
    </div>
  );
}

export default Signup;

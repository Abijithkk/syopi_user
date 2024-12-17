import { useState } from 'react';
import signimg from '../images/Landing.jpeg';
import './signin.css';

function Forget() {
  // State to manage form visibility
  const [isPasswordSet, setIsPasswordSet] = useState(false);

  // State for password input
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handle password input change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsPasswordSet(true); // Show the password setting form
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        {!isPasswordSet ? (
          <>
            <h1>Forgot Password</h1>
            <p>Enter your phone number to receive a link for password recovery.</p>

            <form className="signin-form" onSubmit={handleSubmit}>
              <label>Email or Phone Number</label>
              <input type="text" placeholder="Enter your Email or Phone number" />

              <button type="submit" className="signin-btn">Set Password</button>
            </form>
          </>
        ) : (
          <>
            <h1>Set a Password</h1>
            <p>Please set a password for your account</p>

            <form className="signin-form">
              <label>Enter New Password</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
              />

              <label>Re-enter Password</label>
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                />
                <span
                  className="toggle-password right-icon"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>

              <button type="submit" className="signin-btn mt-3">Set New Password</button>
            </form>
          </>
        )}
      </div>

      <div className="signin-right">
        <img src={signimg} alt="Sign In" />
      </div>
    </div>
  );
}

export default Forget;

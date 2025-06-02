import { useState } from 'react';
import toast from 'react-hot-toast';
import signimg from '../images/Landing.jpeg';
import './signin.css';
import { 
  sendForgotPasswordOtpApi, 
  verifyForgotPasswordOtpApi, 
  resetPasswordApi 
} from '../services/allApi';
import { useNavigate } from 'react-router-dom';

function Forget() {
  // Step tracking: 'email' -> 'otp' -> 'password'
  const [currentStep, setCurrentStep] = useState('email');
  
  // Form data
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tempToken, setTempToken] = useState(''); // Store temp token from OTP verification
  const navigate =useNavigate();
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP timer
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Timer effect for OTP resend
  useState(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (pwd) => {
    return pwd.length >= 8;
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!emailOrPhone.trim()) {
      toast.error('Please enter your email or phone number');
      return;
    }

    // Basic validation
    const isEmail = emailOrPhone.includes('@');
    if (isEmail && !validateEmail(emailOrPhone)) {
      toast.error('Please enter a valid email address');
      return;
    } else if (!isEmail && !validatePhone(emailOrPhone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Sending OTP...');

    try {
      const response = await sendForgotPasswordOtpApi({
        [isEmail ? 'email' : 'phone']: emailOrPhone.trim()
      });

      if (response.status === 200 || response.status === 201) {
        toast.dismiss(loadingToast);
        toast.success('OTP sent successfully! Please check your email/phone.');
        setCurrentStep('otp');
        setOtpTimer(60); 
        setCanResend(false);
      } else {
        throw new Error(response.data?.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to send OTP. Please try again.';
      toast.error(errorMessage);
      console.error('Send OTP Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    const loadingToast = toast.loading('Resending OTP...');

    try {
      const isEmail = emailOrPhone.includes('@');
      const response = await sendForgotPasswordOtpApi({
        [isEmail ? 'email' : 'phone']: emailOrPhone.trim()
      });

      if (response.status === 200 || response.status === 201) {
        toast.dismiss(loadingToast);
        toast.success('OTP resent successfully!');
        setOtpTimer(60);
        setCanResend(false);
      } else {
        throw new Error(response.data?.message || 'Failed to resend OTP');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to resend OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    if (otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Verifying OTP...');

    try {
      const isEmail = emailOrPhone.includes('@');
      const response = await verifyForgotPasswordOtpApi({
        [isEmail ? 'email' : 'phone']: emailOrPhone.trim(),
        otp: otp.trim()
      });

      if (response.status === 200 || response.status === 201) {
        toast.dismiss(loadingToast);
        
        // Store the temp token from the response
        if (response.data?.tempToken) {
          setTempToken(response.data.tempToken);
          toast.success('OTP verified successfully!');
          setCurrentStep('password');
        } else {
          throw new Error('Verification successful but session token not received. Please try again.');
        }
      } else {
        throw new Error(response.data?.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Invalid OTP. Please try again.';
      toast.error(errorMessage);
      console.error('Verify OTP Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    if (!password.trim()) {
      toast.error('Please enter a new password');
      return;
    }
  
    if (!validatePassword(password)) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
  
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
  
    if (!tempToken) {
      toast.error('Session expired. Please verify OTP again.');
      setCurrentStep('otp');
      return;
    }
  
    setIsLoading(true);
    const loadingToast = toast.loading('Resetting password...');
  
    try {
      const response = await resetPasswordApi({
        tempToken: tempToken,
        newPassword: password.trim()
      });
  
      if (response.status === 200 || response.status === 201) {
        toast.dismiss(loadingToast);
        toast.success('Password reset successfully! You can now login with your new password.');
  
        // Navigate to signin after success
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        throw new Error(response.data?.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to reset password. Please try again.';
      toast.error(errorMessage);
      console.error('Reset Password Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Go back to previous step
  const handleGoBack = () => {
    if (currentStep === 'otp') {
      setCurrentStep('email');
      setOtp('');
    } else if (currentStep === 'password') {
      setCurrentStep('otp');
      setPassword('');
      setConfirmPassword('');
      setTempToken(''); 
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        {/* Step 1: Enter Email/Phone */}
        {currentStep === 'email' && (
          <>
            <h1>Forgot Password</h1>
            <p>Enter your email or phone number to receive an OTP for password recovery.</p>
            
            <form className="signin-form" onSubmit={handleSendOtp}>
              <label>Email or Phone Number</label>
              <input 
                type="text" 
                placeholder="Enter your Email or Phone number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                disabled={isLoading}
                required
              />
              
              <button 
                type="submit" 
                className="signin-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          </>
        )}

        {/* Step 2: Enter OTP */}
        {currentStep === 'otp' && (
          <>
            <h1>Verify OTP</h1>
            <p>Enter the OTP sent to {emailOrPhone}</p>
            
            <form className="signin-form" onSubmit={handleVerifyOtp}>
              <label>Enter OTP</label>
              <input 
                type="text" 
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={isLoading}
                maxLength="6"
                required
              />
              
              <div className="otp-actions">
                {otpTimer > 0 ? (
                  <p>Resend OTP in {otpTimer}s</p>
                ) : (
                  <button 
                    type="button" 
                    className="link-btn"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              
              <div className="form-buttons">
                <button 
                  type="button" 
                  className="back-btn"
                  onClick={handleGoBack}
                  disabled={isLoading}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="signin-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 3: Set New Password */}
        {currentStep === 'password' && (
          <>
            <h1>Set New Password</h1>
            <p>Please enter your new password</p>
            
            <form className="signin-form" onSubmit={handleResetPassword}>
              <label>New Password</label>
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  disabled={isLoading}
                  required
                />
                <span
                  className="toggle-password right-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
              
              <label>Confirm New Password</label>
              <div className="password-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  disabled={isLoading}
                  required
                />
                <span
                  className="toggle-password right-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
              
              <div className="form-buttons">
                <button 
                  type="button" 
                  className="back-btn"
                  onClick={handleGoBack}
                  disabled={isLoading}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="signin-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
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
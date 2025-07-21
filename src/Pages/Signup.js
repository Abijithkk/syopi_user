import React, { useState } from "react";
import signimg from "../images/Landing.jpeg";
import "./signup.css";
import { userRegisterpApi, verifyotpApi } from "../services/allApi";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Signup() {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [code, setCode] = useState(Array(6).fill(""));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referredBy, setReferredBy] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };
  const validateInputs = () => {
    let tempErrors = {};
    if (!name.trim()) tempErrors.name = "Name is required";
    if (!email.trim()) tempErrors.email = "Email is required";
    if (!phone.trim()) tempErrors.phone = "Phone number is required";
    // if (!password.trim()) tempErrors.password = "Password is required";
    // if (!confirmPassword.trim())
    //   tempErrors.confirmPassword = "Please confirm your password";

    if (phone && (phone.length !== 10 || !/^\d+$/.test(phone))) {
      tempErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = "Enter a valid email address";
    }

    // if (password && confirmPassword && password !== confirmPassword) {
    //   tempErrors.confirmPassword = "Passwords do not match";
    // }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on typing
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "phone") setPhone(value);
    if (field === "referredBy") setReferredBy(value);
    // if (field === "password") setPassword(value);
    // if (field === "confirmPassword") setConfirmPassword(value);
  };

  const handleCodeChange = (e, index) => {
    const { value } = e.target;
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < code.length - 1) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const handleOTPVerification = async () => {
    // Clear any previous errors
    setVerificationError("");

    // Join the OTP digits into a single string
    const otpValue = code.join("");

    // Validate OTP length
    if (otpValue.length !== 6) {
      setVerificationError("Please enter all 6 digits of the OTP");
      return;
    }

    try {
      const verificationData = {
        phone: phone,
        otp: otpValue,
      };

      const response = await verifyotpApi(verificationData);

      // Handle successful verification
      // You might want to redirect to another page or show a success message
      window.location.href = "/signin"; // or wherever you want to redirect after successful verification
    } catch (error) {
      console.error("OTP verification error:", error);
      setVerificationError(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    }
  };

  const handleResendOTP = async () => {
    try {
      // You might want to call an API endpoint to resend the OTP
      const userData = {
        phone,
      };
      await userRegisterpApi(userData);
      alert("New OTP has been sent to your phone number");
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("Failed to resend OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    setLoading(true);
    const userData = {
      name,
      email,
      phone,
      // password,
      referredBy: referredBy || undefined,
    };

    try {
      const response = await userRegisterpApi(userData);
      if (response.success) {
        toast.success("Registration successful!");
        const { user } = response.data;
        localStorage.setItem("userId", user?.userId || user?._id || user?.id);
        localStorage.setItem("accessuserToken", response.data.accessToken);
        localStorage.setItem("username", user?.name || user?.username);
        localStorage.setItem("email", user?.email);
        localStorage.setItem("role", user?.role || "user");
        navigate("/signin");  

        setIsSignedUp(true);
      } else {
        toast.error(
          response.error?.errors?.map((err) => err.msg).join("\n") ||
            "Registration failed."
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error?.errors?.map((err) => err.msg).join("\n") ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        {!isSignedUp ? (
          <>
            <h1>Let's sign you up</h1>
            <p>
              Get ready to dress your little ones in fashion-forward outfits
            </p>

            <form className="signin-form" onSubmit={handleSubmit}>
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}

              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}

              <label>Phone Number</label>
              <input
                type="text"
                placeholder="Enter your Phone number"
                value={phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={errors.phone ? "input-error" : ""}
              />
              {errors.phone && (
                <span className="error-text">{errors.phone}</span>
              )}

              <label>Referral Code (Optional)</label>
              <input
                type="text"
                placeholder="E7635142194"
                value={referredBy}
                onChange={(e) => handleChange("referredBy", e.target.value)}
              />

              {/* <label>Enter Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}

              <label>Re-enter Password</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className={errors.confirmPassword ? "input-error" : ""}
                />
                <span
                  className="toggle-password right-icon"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )} */}

<button type="submit" className="signin-btn mt-3" disabled={loading}>
  {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Sign Up"}
</button>

            </form>

            <p className="signup-text">
              Already have an account? <a href="/signin">Sign in</a>
            </p>
          </>
        ) : (
          <>
            <h1>We just sent you an SMS</h1>
            <p>Enter the security code we sent to</p>
            <p className="phone-number">+91 {phone}</p>
            <div className="code-input-container">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  id={`code-input-${index}`}
                  className="code-input"
                  value={digit}
                  onChange={(e) => handleCodeChange(e, index)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !digit && index > 0) {
                      document
                        .getElementById(`code-input-${index - 1}`)
                        .focus();
                    }
                  }}
                />
              ))}
            </div>
            {verificationError && (
              <p className="error-message">{verificationError}</p>
            )}
            <button className="signin-btn mt-3" onClick={handleOTPVerification}>
              Verify OTP
            </button>
            <p>
              Didn't receive a code?{" "}
              <button onClick={handleResendOTP} className="resend-link">
                Resend Code
              </button>
            </p>
          </>
        )}
      </div>

      <div className="signin-right">
        <img src={signimg} alt="Sign In" />
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;

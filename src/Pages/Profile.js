import React, { useState } from "react";
import {
  UserCircle,
  ShoppingBag,
  Bell,
  Users,
  MessageSquare,
  HelpCircle,
  MoreHorizontal,
  LogOut,
  IndianRupee,
  ChevronRight,
  X,
  Send,
  Heart,
  Shield,
  RotateCcw,
  MapPin,
  Trash2,
  ChevronLeft,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./profile.css"
import { deleteUserProfileApi } from "../services/allApi";
import toast from "react-hot-toast";

const Profile = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [showFeedbackPortal, setShowFeedbackPortal] = useState(false);
  const [showMoreSection, setShowMoreSection] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path, index) => {
    setActiveItem(index);
    
    if (path === "/feedback") {
      setShowFeedbackPortal(true);
      return;
    }
    
    if (path === "/more") {
      setShowMoreSection(true);
      return;
    }

    if (path === "/delete-account") {
      setShowDeleteConfirmation(true);
      return;
    }
    
    navigate(path);
  };

  // Separate handler for more section navigation
  const handleMoreNavigation = (path, index) => {
    setActiveItem(index);
    
    if (path === "/delete-account") {
      setShowDeleteConfirmation(true);
      return;
    }
    
    navigate(path);
  };

  const handleFeedbackSubmit = () => {
    const subject = "Feedback from SYOPI User";
    const body = `Message:\n${feedbackMessage}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=syopii5051@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(gmailUrl, '_blank');
    setShowFeedbackPortal(false);
    setFeedbackMessage("");
  };
const handleLogout = async () => {
  try {
    // Show loading toast while logging out
    const loadingToast = toast.loading("Logging you out...");
    
    // Clear all user data from localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("accessuserToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    
   
    toast.success("Logged out successfully!");
    
    toast.dismiss(loadingToast);
    
    // Navigate to signin page after a brief delay
    setTimeout(() => {
      navigate("/signin"); 
    }, 1000);
    
  } catch (error) {
    console.error("Logout Error:", error);
    toast.error("Something went wrong during logout. Please try again.");
  }
};
  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      // Call the delete API
      const response = await deleteUserProfileApi();
      
      if (response.status === 200 || response.status === 204) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
        
        // Show success message briefly
        alert('Your account has been successfully deleted.');
        
        // Redirect to login or home page
        navigate('/login');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again or contact support.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const menuItems = [
    {
      icon: <UserCircle className="menu-icon" size={22} />,
      text: "Account Settings",
      path: "/addressdetails",
    },
    {
      icon: <ShoppingBag className="menu-icon" size={22} />,
      text: "Orders",
      path: "/order",
    },
      {
      icon: <Users className="menu-icon" size={22} />,
      text: "Sign in",
      path: "/signin",
    },
    {
      icon: <Bell className="menu-icon" size={22} />,
      text: "Notifications",
      path: "/notifications",
    },
    {
      icon: <Users className="menu-icon" size={22} />,
      text: "Refer & Earn",
      path: "/refer",
    },
    {
      icon: <MessageSquare className="menu-icon" size={22} />,
      text: "Message Center",
      path: "/subscribe",
    },
    {
      icon: <IndianRupee className="menu-icon" size={22} />,
      text: "Earn with SYOPI",
      path: "/earn",
    },
    {
      icon: <HelpCircle className="menu-icon" size={22} />,
      text: "Feedback & Information",
      path: "/feedback",
    },
    {
      icon: <MoreHorizontal className="menu-icon" size={22} />,
      text: "More",
      path: "/more",
    },
  ];

  const moreMenuItems = [
    {
      icon: <Heart className="menu-icon" size={22} />,
      text: "Wishlist",
      path: "/wishlist",
    },
    {
      icon: <Shield className="menu-icon" size={22} />,
      text: "Privacy Policy",
      path: "/privacypolicy",
    },
    {
      icon: <RotateCcw className="menu-icon" size={22} />,
      text: "Return and Refund Policy",
      path: "/returnpolicy",
    },
    {
      icon: <MapPin className="menu-icon" size={22} />,
      text: "Manage Address",
      path: "/manage-address",
    },
    {
      icon: <Trash2 className="menu-icon" size={22} />,
      text: "Delete Account",
      path: "/delete-account",
    },
  ];

  if (showMoreSection) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <div className="user-avatar-wrapper">
            <button 
              onClick={() => setShowMoreSection(false)}
              className="back-button"
              style={{ 
                background: 'none', 
                border: 'none', 
                padding: '8px',
                cursor: 'pointer',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="user-info">
            <h2 className="user-name">More Options</h2>
            <p className="user-subtitle">Additional settings and policies</p>
          </div>
        </div>

        <div className="menu-container">
          {moreMenuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleMoreNavigation(item.path, index)}
              className={`menu-item ${activeItem === index ? "active" : ""}`}
            >
              <div className="menu-item-content">
                <div className="menu-item-icon">{item.icon}</div>
                <span className="menu-item-text">{item.text}</span>
              </div>
              <ChevronRight size={18} className="menu-arrow" />
            </div>
          ))}
        </div>

        <div className="logout-container">
          <button
            onClick={() => setShowMoreSection(false)}
            className="logout-button"
          >
            <ChevronLeft size={20} className="logout-icon" />
            <span>Back to Profile</span>
          </button>
        </div>

        {/* Delete Account Confirmation Modal - Show even when in more section */}
        {showDeleteConfirmation && (
          <div className="feedback-portal-overlay">
            <div className="feedback-portal-wrapper">
              <div className="feedback-portal-container">
                <div className="feedback-portal-header">
                  <div className="feedback-portal-title-section">
                    <div className="feedback-portal-icon-circle" style={{ backgroundColor: '#fee2e2' }}>
                      <AlertTriangle size={24} color="#dc2626" />
                    </div>
                    <h3 className="feedback-portal-title" style={{ color: '#dc2626' }}>Delete Account</h3>
                  </div>
                  <button
                    className="feedback-portal-close"
                    onClick={() => setShowDeleteConfirmation(false)}
                    disabled={isDeleting}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="feedback-portal-body">
                  <p className="feedback-portal-description" style={{ marginBottom: '20px' }}>
                    Are you sure you want to permanently delete your SYOPI account?
                  </p>
                  
                  <div style={{ 
                    backgroundColor: '#fef2f2', 
                    border: '1px solid #fecaca', 
                    borderRadius: '8px', 
                    padding: '16px',
                    marginBottom: '20px'
                  }}>
                    <h4 style={{ 
                      color: '#dc2626', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      marginBottom: '8px' 
                    }}>
                      This action cannot be undone. You will lose:
                    </h4>
                    <ul style={{ 
                      color: '#7f1d1d', 
                      fontSize: '14px', 
                      lineHeight: '1.5',
                      paddingLeft: '20px',
                      margin: 0
                    }}>
                      <li>All your account data and profile information</li>
                      <li>Order history and saved addresses</li>
                      <li>Wishlist items and preferences</li>
                      <li>Earned rewards and referral benefits</li>
                    </ul>
                  </div>

                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    textAlign: 'center',
                    margin: 0
                  }}>
                    If you're having issues, please contact our support team before deleting your account.
                  </p>
                </div>

                <div className="feedback-portal-footer">
                  <button
                    className="feedback-cancel-btn"
                    onClick={() => setShowDeleteConfirmation(false)}
                    disabled={isDeleting}
                    style={{ 
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db'
                    }}
                  >
                    Keep Account
                  </button>
                  <button
                    className="feedback-submit-btn"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    style={{ 
                      backgroundColor: '#dc2626',
                      borderColor: '#dc2626',
                      opacity: isDeleting ? 0.7 : 1,
                      cursor: isDeleting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Trash2 size={18} />
                    <span>{isDeleting ? 'Deleting...' : 'Delete Account'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="user-avatar-wrapper">
          <div className="user-avatar">
            <UserCircle size={34} />
          </div>
        </div>
        <div className="user-info">
          <h2 className="user-name">User Profile</h2>
          <p className="user-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      <div className="menu-container">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleNavigation(item.path, index)}
            className={`menu-item ${activeItem === index ? "active" : ""}`}
          >
            <div className="menu-item-content">
              <div className="menu-item-icon">{item.icon}</div>
              <span className="menu-item-text">{item.text}</span>
            </div>
            <ChevronRight size={18} className="menu-arrow" />
          </div>
        ))}
      </div>

      <div className="logout-container">
        <button
         onClick={handleLogout}
          className="logout-button"
        >
          <LogOut size={20} className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>

      {showFeedbackPortal && (
        <div className="feedback-portal-overlay">
          <div className="feedback-portal-wrapper">
            <div className="feedback-portal-container">
              <div className="feedback-portal-header">
                <div className="feedback-portal-title-section">
                  <div className="feedback-portal-icon-circle">
                    <HelpCircle size={24} />
                  </div>
                  <h3 className="feedback-portal-title">Share Your Experience</h3>
                </div>
                <button
                  className="feedback-portal-close"
                  onClick={() => setShowFeedbackPortal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="feedback-portal-body">
                <p className="feedback-portal-description">
                  Your feedback helps us improve SYOPI. Share your thoughts, suggestions, or report any issues you've encountered.
                </p>

                <div className="feedback-message-section">
                  <label className="feedback-message-label">Your Message</label>
                  <textarea
                    className="feedback-message-textarea"
                    placeholder="Tell us about your experience, suggestions, or any issues you've encountered..."
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>

              <div className="feedback-portal-footer">
                <button
                  className="feedback-cancel-btn"
                  onClick={() => setShowFeedbackPortal(false)}
                >
                  Cancel
                </button>
                <button
                  className="feedback-submit-btn"
                  onClick={handleFeedbackSubmit}
                  disabled={!feedbackMessage.trim()}
                >
                  <Send size={18} />
                  <span>Send Feedback</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal - Only show when not in more section */}
      {showDeleteConfirmation && (
        <div className="feedback-portal-overlay">
          <div className="feedback-portal-wrapper">
            <div className="feedback-portal-container">
              <div className="feedback-portal-header">
                <div className="feedback-portal-title-section">
                  <div className="feedback-portal-icon-circle" style={{ backgroundColor: '#fee2e2' }}>
                    <AlertTriangle size={24} color="#dc2626" />
                  </div>
                  <h3 className="feedback-portal-title" style={{ color: '#dc2626' }}>Delete Account</h3>
                </div>
                <button
                  className="feedback-portal-close"
                  onClick={() => setShowDeleteConfirmation(false)}
                  disabled={isDeleting}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="feedback-portal-body">
                <p className="feedback-portal-description" style={{ marginBottom: '20px' }}>
                  Are you sure you want to permanently delete your SYOPI account?
                </p>
                
                <div style={{ 
                  backgroundColor: '#fef2f2', 
                  border: '1px solid #fecaca', 
                  borderRadius: '8px', 
                  padding: '16px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ 
                    color: '#dc2626', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    marginBottom: '8px' 
                  }}>
                    This action cannot be undone. You will lose:
                  </h4>
                  <ul style={{ 
                    color: '#7f1d1d', 
                    fontSize: '14px', 
                    lineHeight: '1.5',
                    paddingLeft: '20px',
                    margin: 0
                  }}>
                    <li>All your account data and profile information</li>
                    <li>Order history and saved addresses</li>
                    <li>Wishlist items and preferences</li>
                    <li>Earned rewards and referral benefits</li>
                  </ul>
                </div>

                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280',
                  textAlign: 'center',
                  margin: 0
                }}>
                  If you're having issues, please contact our support team before deleting your account.
                </p>
              </div>

              <div className="feedback-portal-footer">
                <button
                  className="feedback-cancel-btn"
                  onClick={() => setShowDeleteConfirmation(false)}
                  disabled={isDeleting}
                  style={{ 
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db'
                  }}
                >
                  Keep Account
                </button>
                <button
                  className="feedback-submit-btn"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  style={{ 
                    backgroundColor: '#dc2626',
                    borderColor: '#dc2626',
                    opacity: isDeleting ? 0.7 : 1,
                    cursor: isDeleting ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Trash2 size={18} />
                  <span>{isDeleting ? 'Deleting...' : 'Delete Account'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
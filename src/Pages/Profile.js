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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

const Profile = () => {
  const [activeItem, setActiveItem] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = (path, index) => {
    setActiveItem(index);
    console.log(`Navigating to: ${path}`);
    navigate(path); // no extra slash
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
          onClick={() => handleNavigation("/logout", null)}
          className="logout-button"
        >
          <LogOut size={20} className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;

import React, { useCallback, useEffect, useState } from "react";
import "./Offer.css";
import { BASE_URL } from "../services/baseUrl";
import { useNavigate } from "react-router-dom";
import { getProfileApi } from "../services/allApi";
import toast, { Toaster } from "react-hot-toast";

function Offer({ offerData }) {
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setProfileError(null);
      const response = await getProfileApi();
      
      if (response.success && response.data.user) {
        const user = response.data.user;
        setReferralCode(user.referralCode || "");
        setUserData(user);
      } else {
        const errorMessage = response.error?.message || "Failed to load profile data";
        setProfileError(errorMessage);
       
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      const errorMessage = error.response?.data?.error?.message || "An error occurred while loading your profile";
      setProfileError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleCardClick = (id, index) => {
    if (index === 0) {
      handleShareReferral();
    } else {
      navigate(`/referral/${id}`);
    }
  };

  const handleShareReferral = () => {
    if (profileError) {
      toast.error(profileError);
      return;
    }
    
    if (!referralCode) {
      toast.error("Referral code is not available. Please try again later.");
      return;
    }

    const shareText = `Hey, Sign up for SYOPI and use my referral code SYOPI-${referralCode} to get free coins! 🎉 Don't miss out – start now and enjoy the benefits! https://syopi.com/`;
    
    // Create WhatsApp share URL
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    
    // Open WhatsApp share in a new tab
    window.open(whatsappUrl, '_blank');
    
    toast.success("Opening WhatsApp to share your referral!");
  };

  if (loading) {
    return (
      <div className="offer">
        <div className="offer-container">
          <div className="loading-spinner">Loading offers...</div>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="offer">
      <div className="offer-container">
        <p className="offer-heading">Check these offers, made for you!</p>
        <div className="offer-div">
          {offerData && offerData.map((offer, index) => (
            <div 
              onClick={() => handleCardClick(offer._id, index)}
              style={{ cursor: "pointer" }} 
              className="offer-card" 
              key={offer._id}
            >
              <img
                src={`${BASE_URL}/uploads/${encodeURIComponent(offer.image)}`}
                alt={offer.title}
                className="offer-card-image"
              />
              <h3 className="offer-card-heading">{offer.title}</h3>
              <p className="offer-card-subheading">
                {index === 0 ? "Share your referral code and earn rewards!" : offer.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}  

export default Offer;
import React, { useEffect, useState } from "react";
import "./Vendors.css";
import { useNavigate } from "react-router-dom";
import { getAllVendorStoreApi } from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";

function Vendors() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await getAllVendorStoreApi();
      console.log("vendors", res);
      if (res?.data?.success) {
        const formatted = res.data.data.map((item) => ({
          id: item.vendorId?._id,
          name: item.vendorId?.businessname,

          logo: item.vendorId?.storelogo
            ? `${BASE_URL}/uploads/${item.vendorId.storelogo}`
            : "https://via.placeholder.com/100?text=No+Logo",
        }));
        console.log(res);
        setVendors(formatted);
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  };

  const handleNavigation = (id) => {
    navigate(`/vendor/${id}`);
  };

  return (
    <div className="popular-vendors-container">
      <div className="popular-vendors-header">
        <p className="fproductheading">Popular Vendors</p>
      </div>

      <div className="popular-vendors-scroll-wrapper">
        <div className="popular-vendors-list">
          {vendors.length > 0 ? (
            vendors.map((vendor) => (
              <div
                key={vendor.id}
                onClick={() => handleNavigation(vendor.id)}
                className="popular-vendor-card"
              >
                <div className="popular-vendor-circle">
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    className="popular-vendor-logo"
                  />
                </div>
                <span className="popular-vendor-name">{vendor.name}</span>
              </div>
            ))
          ) : (
            <p className="no-vendors-text">No vendors available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vendors;

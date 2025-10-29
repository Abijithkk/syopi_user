import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VendorProducts from "../components/VendorProducts";
import VendorCategories from "../components/VendorCategories";
import Recommended from "../components/Recommended";
import VendorProductSliders from "../components/VendorProductSliders";
import { getVendorStoreByIdApi } from "../services/allApi";
import "./VendorDetails.css";
import { BASE_URL } from "../services/baseUrl";

function VendorDetails() {
  const { id } = useParams();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorDetails();
  }, [id]);

  const fetchVendorDetails = async () => {
    try {
      const res = await getVendorStoreByIdApi(id);
      if (res?.data?.success) {
        setVendorData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching vendor details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="vendor-loading">Loading vendor details...</p>;
  if (!vendorData) return <p className="vendor-error">No vendor data found.</p>;

  const backgroundImage = vendorData.background?.image
    ? `${BASE_URL}/uploads/${vendorData.background.image}`
    : null;

  return (
    <>
      {/* Full-width background section */}
      <div
        className="vendor-background-combined"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textAlign: "center",
          padding: "60px 0",
        }}
      >
        {backgroundImage && (
          <div>
            <h2 className="inbox-fashion-brand">
              {vendorData.background?.title || "Brand"}
            </h2>
            <h4 className="inbox-fashion-collections">
              {vendorData.background?.subtitle || "Collection"}
            </h4>
          </div>
        )}

        {/* Vendor products inside same background */}
        <VendorProducts banners={vendorData.banners || []} />
      </div>

      {/* Content inside padded container */}
      <div className="inbox-fashion-container2">
        <VendorCategories subcategories={vendorData.subcategories || []} />
        <Recommended />
        <VendorProductSliders bottomBanner={vendorData.bottomBanner || null} />
      </div>
    </>
  );
}

export default VendorDetails;

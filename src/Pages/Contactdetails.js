import React, { useCallback, useEffect, useState } from "react";
import "./contactdetails.css";
import cd from "../images/cd.png";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { getProfileApi, updateProfileApi } from "../services/allApi";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../services/baseUrl";

function Contactdetails() {
  const [formData, setFormData] = useState({
    firstName: "",
    phone: "",
    email: "",
    gender: "",
    image: null
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [coin, setCoin] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);

const fetchProfile = useCallback(async () => {
  setLoading(true);
  try {
    const response = await getProfileApi();
    console.log(response);
    
    if (response.success && response.data.user) {
      const user = response.data.user;
      const userData = {
        firstName: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        gender: user.gender || "",
        image: user.image || null
      };
      
      setFormData(userData);
      setOriginalData(userData);
      setCoin(user.coins || 0);
      
      // Set image preview if profile image exists
      if (user.image) {
        const fullImageUrl = `${BASE_URL}/uploads/${user.image}`;
        setImagePreview(fullImageUrl);
      } else {
        setImagePreview(cd);
      }
    } else {
      setError(response.error || "Failed to fetch profile");
    }
  } catch {
    setError("An error occurred while fetching profile");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.match('image.*')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      
      setFormData((prev) => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

const handleSave = async () => {
  // Check if any fields have actually changed
  const changes = {};
  
  Object.keys(formData).forEach(key => {
    // Special handling for image comparison (File object vs string)
    if (key === 'image') {
      if (formData.image instanceof File || formData.image !== originalData.image) {
        changes[key] = formData[key];
      }
    } else if (formData[key] !== originalData[key]) {
      changes[key] = formData[key];
    }
  });
  
  // If no changes, show message and return
  if (Object.keys(changes).length === 0) {
    toast.info("No changes to save");
    return;
  }
  
  setSaving(true);
  setError("");
  try {
    // Create FormData for the request
    const formDataToSend = new FormData();
    
    if (changes.hasOwnProperty('firstName')) {
      formDataToSend.append('name', changes.firstName);
    }
    if (changes.hasOwnProperty('phone')) {
      formDataToSend.append('phone', changes.phone);
    }
    if (changes.hasOwnProperty('email')) {
      formDataToSend.append('email', changes.email);
    }
    if (changes.hasOwnProperty('gender')) {
      formDataToSend.append('gender', changes.gender);
    }
    if (changes.hasOwnProperty('image') && changes.image) {
      formDataToSend.append('image', changes.image);
    }
    
    const response = await updateProfileApi(formDataToSend);
    
    if (response.status === 204 || response.success) {
      // Update original data with changes
      const updatedOriginalData = {...originalData};
      
      Object.keys(changes).forEach(key => {
        // For image, we need to handle the server response
        if (key === 'image' && response.data && response.data.image) {
          updatedOriginalData.image = response.data.image; // Store the filename
        } else {
          updatedOriginalData[key] = changes[key];
        }
      });
      
      setOriginalData(updatedOriginalData);
      
      // If we uploaded an image, update the preview with the new image URL
      if (changes.image && response.data && response.data.image) {
        const fullImageUrl = `${BASE_URL}/uploads/${response.data.image}`;
        setImagePreview(fullImageUrl);
      } else if (changes.image) {
        // Fallback: use the preview URL (local file preview)
        setImagePreview(imagePreview);
      }
      
      // Also update formData to replace File object with image filename if available
      if (changes.image && response.data && response.data.image) {
        setFormData(prev => ({
          ...prev,
          image: response.data.image
        }));
      }
      
      toast.success("Profile updated successfully!");
      
      fetchProfile();
      
    } else {
      const errorMsg = response.error || "Failed to update profile";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  } catch (error) {
    console.error("Update error:", error);
    const errorMsg = error.response?.data?.error || "An error occurred while updating profile";
    setError(errorMsg);
    toast.error(errorMsg);
  } finally {
    setSaving(false);
  }
};

  return (
    <div>
      <p className="contact-details-title mt-5">Account Details</p>
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="contact-details-form">
          <Form className="mt-3 p-4">
            <div className="contact-details-container">
              <label htmlFor="profile-image-upload" className="image-upload-label">
                <img 
                  className="contact-details-img" 
                  src={imagePreview || cd} 
                  alt="Profile" 
                />
                <div className="image-overlay">
                  <i className="fas fa-camera"></i>
                </div>
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            
            <div className="coin-display d-flex align-items-center mb-3">
              <div
                className="coin-icon"
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "gold",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  C
                </span>
              </div>
              <span
                className="coin-amount ms-2 fw-bold"
                style={{ fontSize: "16px" }}
              >
                {coin ?? 0}
              </span>
            </div>

            <Row className="mt-4">
              <Col xs={12} className="mb-3">
                <Form.Group controlId="firstName">
                  <Form.Label className="form-head">Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="custom-placeholder"
                    placeholder="Enter Name"
                    style={{
                      border: "1px solid #9F9F9F",
                      borderRadius: "12px",
                      padding: "10px",
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col xs={12} className="mb-3">
                <Form.Group controlId="email">
                  <Form.Label className="form-head">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="custom-placeholder"
                    placeholder="Enter Email"
                    style={{
                      border: "1px solid #9F9F9F",
                      borderRadius: "12px",
                      padding: "10px",
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="phone" className="mb-3">
              <Form.Label className="form-head">Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="custom-placeholder"
                placeholder="Enter Phone Number"
                style={{
                  border: "1px solid #9F9F9F",
                  borderRadius: "12px",
                  padding: "10px",
                }}
              />
            </Form.Group>

            <Form.Group controlId="gender" className="mb-3">
              <Form.Label className="form-head">Gender</Form.Label>
              <div style={{ display: "flex" }}>
                {["male", "female", "other"].map((g) => (
                  <Form.Check
                    key={g}
                    inline
                    label={g.charAt(0).toUpperCase() + g.slice(1)}
                    name="gender"
                    type="radio"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                    className="custom-bootstrap-radio"
                  />
                ))}
              </div>
            </Form.Group>

            <div className="d-flex justify-content-center mt-4">
              <button
                type="button"
                className="form-button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </Form>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
}

export default Contactdetails;
import React, { useCallback, useEffect, useState } from "react";
import "./contactdetails.css";
import cd from "../images/cd.png";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { getProfileApi, updateProfileApi } from "../services/allApi";
import { toast, ToastContainer } from "react-toastify";

function Contactdetails() {
  const [formData, setFormData] = useState({
    firstName: "",
    phone: "",
    email: "",
    gender: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [coin, setCoin] = useState(0);

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
        };
        
        setFormData(userData);
        setOriginalData(userData);
        setCoin(user.coins || 0); 
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

  const handleSave = async () => {
    // Check if any fields have actually changed
    const changes = {};
    
    Object.keys(formData).forEach(key => {
      if (formData[key] !== originalData[key]) {
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
      // Map the changes to the expected API format
      const profileData = {};
      
      if (changes.hasOwnProperty('firstName')) {
        profileData.name = changes.firstName;
      }
      if (changes.hasOwnProperty('phone')) {
        profileData.phone = changes.phone;
      }
      if (changes.hasOwnProperty('email')) {
        profileData.email = changes.email;
      }
      if (changes.hasOwnProperty('gender')) {
        profileData.gender = changes.gender;
      }
      
      const response = await updateProfileApi(profileData);
      if (response.status===204) {
        setOriginalData({...originalData, ...changes});
        toast.success("Profile updated successfully!");
      } else {
        setError(response.error || "Failed to update profile");
        toast.error(response.error || "Failed to update profile");
      }
    } catch {
      setError("An error occurred while updating profile");
      toast.error("An error occurred while updating profile");
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
              <img className="contact-details-img" src={cd} alt="Profile" />
              
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
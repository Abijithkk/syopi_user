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
    location: "",
    email:"",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [coin, setCoin] = useState(0);


  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProfileApi();
      if (response.success && response.data.user) {
        const user = response.data.user;
        setFormData({
          firstName: user.name || "",
          phone: user.phone || "",
          email: user.email || "",
          location: user.location || "",
          gender: user.gender || "",
        });
        setCoin(user.coins || 0); // Add this line
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
    setSaving(true);
    setError("");
    try {
      const profileData = {
        name: formData.firstName,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        gender: formData.gender,
      };
      const response = await updateProfileApi(profileData);
      if (response.success) {
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
              <button type="button" className="edit-profile-button">Edit Profile</button>
            </div>
            <div className="coin-display d-flex align-items-center mb-3">
      <div className="coin-icon" style={{
        width: '20px',
        height: '20px',
        backgroundColor: 'gold',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'black' }}>C</span>
      </div>
      <span className="coin-amount ms-2 fw-bold" style={{ fontSize: '16px' }}>{coin ?? 0}</span>
    </div>

            {error && <p className="text-danger text-center">{error}</p>}

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
                    style={{ border: "1px solid #9F9F9F", borderRadius: "12px", padding: "10px" }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col xs={12} className="mb-3">
                <Form.Group controlId="firstName">
                  <Form.Label className="form-head">Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="custom-placeholder"
                    placeholder="Enter Name"
                    style={{ border: "1px solid #9F9F9F", borderRadius: "12px", padding: "10px" }}
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
                style={{ border: "1px solid #9F9F9F", borderRadius: "12px", padding: "10px" }}
              />
            </Form.Group>

            <Form.Group controlId="location" className="mb-3">
              <Form.Label className="form-head">Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="custom-placeholder"
                placeholder="Enter Location"
                style={{ border: "1px solid #9F9F9F", borderRadius: "12px", padding: "10px" }}
              />
            </Form.Group>

            <Form.Group controlId="gender" className="mb-3">
              <Form.Label className="form-head">Gender</Form.Label>
              <div style={{ display: "flex" }}>
                {['male', 'female', 'other'].map((g) => (
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
                {saving ? (<Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />) : "Save Changes"}
              </button>
            </div>
          </Form>
        </div>
      )}
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />

    </div>
  );
}

export default Contactdetails;

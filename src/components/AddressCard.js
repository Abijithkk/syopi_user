import React, { useState } from "react";
import { Row, Col, Card, Form, Spinner } from "react-bootstrap";
import Select from "react-select";
import { addAddressApi } from "../services/allApi";
import { toast, ToastContainer } from "react-toastify";

const indianStates = [
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Assam", label: "Assam" },
  { value: "Bihar", label: "Bihar" },
  { value: "Chhattisgarh", label: "Chhattisgarh" },
  { value: "Goa", label: "Goa" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Haryana", label: "Haryana" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh" },
  { value: "Jharkhand", label: "Jharkhand" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Odisha", label: "Odisha" },
  { value: "Punjab", label: "Punjab" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Telangana", label: "Telangana" },
  { value: "Tripura", label: "Tripura" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Uttarakhand", label: "Uttarakhand" },
  { value: "West Bengal", label: "West Bengal" },
];
function AddressCard({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    alternatenumber: "",
    address: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    addressType: "home",
  });

  const [selectedType, setSelectedType] = useState("home");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Regular expressions for validation
  const phoneRegex = /^[6-9]\d{9}$/;

  // Handle form field changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Validate fields immediately
    validateField(id, value);
  };

  const handleStateChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, state: selectedOption.value }));
  };

  // Field validation function
  const validateField = (id, value) => {
    let newErrors = { ...errors };
  
    if (id === "number") {
      newErrors.number = phoneRegex.test(value) ? "" : "Enter a valid 10-digit phone number";
      
      // Only check alternate number conflict if it's already filled
      if (formData.alternatenumber && value === formData.alternatenumber) {
        newErrors.number = "Primary number cannot be the same as alternate number";
      }
    } 
  
    if (id === "alternatenumber") {
      newErrors.alternatenumber = phoneRegex.test(value) ? "" : "Enter a valid 10-digit phone number";
      
      // Only check number conflict if it's already filled
      if (formData.number && value === formData.number) {
        newErrors.alternatenumber = "Alternate number cannot be the same as primary number";
      }
    }
  
    setErrors(newErrors);
  };
  
  

  const handleAddAddress = async () => {
    setLoading(true);

    // Check if all required fields are filled
    if (
      !formData.name ||
      !formData.number ||
      !formData.alternatenumber ||
      !formData.address ||
      !formData.landmark ||
      !formData.pincode ||
      !formData.city ||
      !formData.state
    ) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Final validation check
    if ( errors.number || errors.alternatenumber) {
      toast.error("Please correct errors before submitting.");
      setLoading(false);
      return;
    }

    try {
      const response = await addAddressApi({ ...formData, addressType: selectedType });
    
      if (response.success) {
        toast.success("Address added successfully!");
        setFormData({
          name: "",
          number: "",
          alternatenumber: "",
          address: "",
          landmark: "",
          pincode: "",
          city: "",
          state: "",
          addressType: "home",
        });
        onSuccess();
      } else {
        toast.error(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="contact-item mb-4 p-4">
        <Card.Title className="contact-title">Contact Details</Card.Title>
        <Form className="mt-3">
          <Row>
            <Col xs={12} md={12} className="mb-3">
              <Form.Group controlId="name">
                <Form.Label className="form-head">Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ border: "1px solid #9F9F9F", borderRadius: "12px" }}
                />
              </Form.Group>
            </Col>
           
          </Row>

          <Row>
            <Col xs={12} md={6} className="mb-3">
              <Form.Group controlId="number">
                <Form.Label className="form-head">Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.number}
                  onChange={handleChange}
                  isInvalid={!!errors.number}
                  style={{ border: "1px solid #9F9F9F", borderRadius: "12px" }}
                />
                <Form.Control.Feedback type="invalid">{errors.number}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} className="mb-3">
              <Form.Group controlId="alternatenumber">
                <Form.Label className="form-head">Alternate Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.alternatenumber}
                  onChange={handleChange}
                  isInvalid={!!errors.alternatenumber}
                  style={{ border: "1px solid #9F9F9F", borderRadius: "12px" }}
                />
                <Form.Control.Feedback type="invalid">{errors.alternatenumber}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="address" className="mb-3">
            <Form.Label className="form-head">Address</Form.Label>
            <Form.Control
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="House No, Building, Street, Area"
              style={{ border: "1px solid #9F9F9F", borderRadius: "12px" }}
            />
          </Form.Group>

          <Form.Group controlId="pincode" className="mb-3">
            <Form.Label className="form-head">Pincode</Form.Label>
            <Form.Control
              type="text"
              value={formData.pincode}
              onChange={handleChange}
              style={{ border: "1px solid #9F9F9F", borderRadius: "12px" }}
            />
          </Form.Group>

          <Form.Group controlId="city" className="mb-3">
            <Form.Label className="form-head">City</Form.Label>
            <Form.Control
              type="text"
              value={formData.city}
              onChange={handleChange}
              style={{ border: "1px solid #9F9F9F", borderRadius: "12px" }}
            />
          </Form.Group>

          <Form.Group controlId="state" className="mb-3">
            <Form.Label className="form-head">State</Form.Label>
            <Select
              options={indianStates}
              placeholder="Select State"
              isSearchable
              value={indianStates.find((state) => state.value === formData.state)}
              onChange={handleStateChange}
              styles={{
                control: (provided) => ({
                  ...provided,
                  border: "1px solid #9F9F9F",
                  borderRadius: "12px",
                  padding: "2px",
                }),
              }}
            />
          </Form.Group>
          <Form.Group controlId="landmark" className="mb-3">
            <Form.Label className="form-head">Landmark</Form.Label>
            <Form.Control
              type="text"
              value={formData.landmark}
              onChange={handleChange}
              style={{ border: "1px solid #9F9F9F", borderRadius: "12px" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-head">Save Address As</Form.Label>
            <div className="d-flex gap-2">
              <button
                type="button"
                className={selectedType === "home" ? "form-home-button" : "form-work-button"}
                onClick={() => setSelectedType("home")}
              >
                Home
              </button>
              <button
                type="button"
                className={selectedType === "work" ? "form-home-button" : "form-work-button"}
                onClick={() => setSelectedType("work")}
              >
                Work
              </button>
            </div>
          </Form.Group>

          <div className="d-flex justify-content-center mt-4">
            <button type="button" className="form-button" onClick={handleAddAddress} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "ADD ADDRESS"}
            </button>
          </div>
        </Form>
      </Card>
      <ToastContainer />
    </div>
  );
}
export default AddressCard;

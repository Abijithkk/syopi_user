import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Spinner, Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import { deleteAddressApi, getAddressApi, updateAddressApi } from '../services/allApi';
import AddressCard from '../components/AddressCard';
import { toast, ToastContainer } from 'react-toastify';
import { FaEdit, FaTrash, FaHome, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';

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

function ManageAddress() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editFormData, setEditFormData] = useState({
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
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Regular expressions for validation
  const phoneRegex = /^[6-9]\d{9}$/;

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await getAddressApi();
      if (response.success) {
        setAddresses(response.data || []);
      } else {
        toast.error("Failed to fetch addresses");
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Something went wrong while fetching addresses");
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit form field changes
  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [id]: value }));
    validateEditField(id, value);
  };

  const handleEditStateChange = (selectedOption) => {
    setEditFormData((prev) => ({ ...prev, state: selectedOption.value }));
  };

  // Field validation for edit form
  const validateEditField = (id, value) => {
    let newErrors = { ...editErrors };

    if (id === "number") {
      newErrors.number = phoneRegex.test(value) ? "" : "Enter a valid 10-digit phone number";
      
      if (editFormData.alternatenumber && value === editFormData.alternatenumber) {
        newErrors.number = "Primary number cannot be the same as alternate number";
      }
    } 

    if (id === "alternatenumber") {
      newErrors.alternatenumber = phoneRegex.test(value) ? "" : "Enter a valid 10-digit phone number";
      
      if (editFormData.number && value === editFormData.number) {
        newErrors.alternatenumber = "Alternate number cannot be the same as primary number";
      }
    }

    setEditErrors(newErrors);
  };

  // Open edit modal
  const handleEditClick = (address) => {
    setSelectedAddress(address);
    setEditFormData({
      name: address.name || "",
      number: address.number || "",
      alternatenumber: address.alternatenumber || "",
      address: address.address || "",
      landmark: address.landmark || "",
      pincode: address.pincode || "",
      city: address.city || "",
      state: address.state || "",
      addressType: address.addressType || "home",
    });
    setEditErrors({});
    setShowEditModal(true);
  };

  // Handle edit address
  const handleUpdateAddress = async () => {
    setEditLoading(true);

    // Check if all required fields are filled
    if (
      !editFormData.name ||
      !editFormData.number ||
      !editFormData.alternatenumber ||
      !editFormData.address ||
      !editFormData.landmark ||
      !editFormData.pincode ||
      !editFormData.city ||
      !editFormData.state
    ) {
      toast.error("Please fill in all required fields.");
      setEditLoading(false);
      return;
    }

    // Final validation check
    if (editErrors.number || editErrors.alternatenumber) {
      toast.error("Please correct errors before submitting.");
      setEditLoading(false);
      return;
    }

    try {
      const response = await updateAddressApi(selectedAddress.id, editFormData);
      
      if (response.success) {
        toast.success("Address updated successfully!");
        setShowEditModal(false);
        fetchAddresses(); // Refresh addresses list
      } else {
        toast.error(`Error: ${response.error || "Failed to update address"}`);
      }
    } catch (error) {
      console.error("Update API Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  // Open delete modal
  const handleDeleteClick = (address) => {
    setSelectedAddress(address);
    setShowDeleteModal(true);
  };

  // Handle delete address
  const handleDeleteAddress = async () => {
    setDeleteLoading(true);
    
    try {
      const response = await deleteAddressApi(selectedAddress.id);
      
      if (response.success) {
        toast.success("Address deleted successfully!");
        setShowDeleteModal(false);
        fetchAddresses(); // Refresh addresses list
      } else {
        toast.error(`Error: ${response.error || "Failed to delete address"}`);
      }
    } catch (error) {
      console.error("Delete API Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle successful address addition
  const handleAddressAdded = () => {
    fetchAddresses(); // Refresh addresses list when new address is added
  };

  const renderAddressCard = (address) => (
    <Card key={address.id} className="contact-item mb-3 p-3" style={{ border: "1px solid #E0E0E0", borderRadius: "12px" }}>
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <div className="d-flex align-items-center mb-2">
            {address.addressType === "home" ? (
              <FaHome className="me-2" style={{ color: "#28a745" }} />
            ) : (
              <FaBriefcase className="me-2" style={{ color: "#007bff" }} />
            )}
            <h6 className="mb-0 text-capitalize fw-bold">{address.addressType}</h6>
          </div>
          
          <div className="mb-2">
            <strong className="form-head">{address.name}</strong>
          </div>
          
          <div className="mb-2">
            <span className="text-muted">Phone: </span>
            <span>{address.number}</span>
            {address.alternatenumber && (
              <>
                <span className="text-muted"> | Alt: </span>
                <span>{address.alternatenumber}</span>
              </>
            )}
          </div>
          
          <div className="mb-2 d-flex align-items-start">
            <FaMapMarkerAlt className="me-2 mt-1 text-muted" />
            <div>
              <div>{address.address}</div>
              {address.landmark && <div className="text-muted">Near: {address.landmark}</div>}
              <div>{address.city}, {address.state} - {address.pincode}</div>
            </div>
          </div>
        </div>
        
        <div className="d-flex flex-column gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleEditClick(address)}
            className="d-flex align-items-center"
            style={{ borderRadius: "8px" }}
          >
            <FaEdit className="me-1" />
            Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDeleteClick(address)}
            className="d-flex align-items-center"
            style={{ borderRadius: "8px" }}
          >
            <FaTrash className="me-1" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          {/* Add Address Section */}
          <div className="mb-4">
            <AddressCard onSuccess={handleAddressAdded} />
          </div>

          {/* Saved Addresses Section */}
          <Card className="p-4" style={{ border: "1px solid #E0E0E0", borderRadius: "12px" }}>
            <Card.Title className="contact-title mb-3">Saved Addresses</Card.Title>
            
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">No addresses found. Add your first address above.</p>
              </div>
            ) : (
              <div>
                {addresses.map(renderAddressCard)}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Edit Address Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col xs={12} className="mb-3">
                <Form.Group controlId="name">
                  <Form.Label className="form-head">Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.name}
                    onChange={handleEditChange}
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
                    value={editFormData.number}
                    onChange={handleEditChange}
                    isInvalid={!!editErrors.number}
                    style={{ border: "1px solid #9F9F9F", borderRadius: "12px" }}
                  />
                  <Form.Control.Feedback type="invalid">{editErrors.number}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} className="mb-3">
                <Form.Group controlId="alternatenumber">
                  <Form.Label className="form-head">Alternate Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.alternatenumber}
                    onChange={handleEditChange}
                    isInvalid={!!editErrors.alternatenumber}
                    style={{ border: "1px solid #9F9F9F", borderRadius: "12px" }}
                  />
                  <Form.Control.Feedback type="invalid">{editErrors.alternatenumber}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="address" className="mb-3">
              <Form.Label className="form-head">Address</Form.Label>
              <Form.Control
                type="text"
                value={editFormData.address}
                onChange={handleEditChange}
                placeholder="House No, Building, Street, Area"
                style={{ border: "1px solid #9F9F9F", borderRadius: "12px" }}
              />
            </Form.Group>

            <Row>
              <Col xs={12} md={6} className="mb-3">
                <Form.Group controlId="pincode">
                  <Form.Label className="form-head">Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.pincode}
                    onChange={handleEditChange}
                    style={{ border: "1px solid #9F9F9F", borderRadius: "12px" }}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} className="mb-3">
                <Form.Group controlId="city">
                  <Form.Label className="form-head">City</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.city}
                    onChange={handleEditChange}
                    style={{ border: "1px solid #9F9F9F", borderRadius: "12px" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="state" className="mb-3">
              <Form.Label className="form-head">State</Form.Label>
              <Select
                options={indianStates}
                placeholder="Select State"
                isSearchable
                value={indianStates.find((state) => state.value === editFormData.state)}
                onChange={handleEditStateChange}
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
                value={editFormData.landmark}
                onChange={handleEditChange}
                style={{ border: "1px solid #9F9F9F", borderRadius: "12px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-head">Save Address As</Form.Label>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={editFormData.addressType === "home" ? "form-home-button" : "form-work-button"}
                  onClick={() => setEditFormData(prev => ({ ...prev, addressType: "home" }))}
                >
                  Home
                </button>
                <button
                  type="button"
                  className={editFormData.addressType === "work" ? "form-home-button" : "form-work-button"}
                  onClick={() => setEditFormData(prev => ({ ...prev, addressType: "work" }))}
                >
                  Work
                </button>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={editLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateAddress} disabled={editLoading}>
            {editLoading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Update Address
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this address?</p>
          {selectedAddress && (
            <div className="bg-light p-3 rounded">
              <strong>{selectedAddress.name}</strong><br />
              {selectedAddress.address}<br />
              {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAddress} disabled={deleteLoading}>
            {deleteLoading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Delete Address
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default ManageAddress;
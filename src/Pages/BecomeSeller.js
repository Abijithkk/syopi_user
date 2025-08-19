import React, { useEffect, useState } from "react";
import "./BecomeSeller.css";
import { becomeSellerApi } from "../services/allApi";
import { toast, ToastContainer } from 'react-toastify';

function BecomeSeller() {
  const [formData, setFormData] = useState({
    // Personal Information
    ownername: "",
    email: "",
    password: "",
    number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",

    // Business Information
    businessname: "",
    businesslocation: "",
    businesslandmark: "",
    description: "",
    storetype: "",

    bankDetails: {
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
      ifscCode: "",
    },
    gstNumber: "",
  });

  const [files, setFiles] = useState({
    storelogo: null,
    license: null,
    images: [],
    passbookImage: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("bank_")) {
      const bankField = name.replace("bank_", "");
      setFormData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [bankField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

const handleFileChange = (e) => {
  const { name, files: selectedFiles } = e.target
  
  if (name === 'images') {
    const newImages = Array.from(selectedFiles)
    
    // Create preview URLs for new images
    const newPreviews = newImages.map(file => URL.createObjectURL(file))
    
    // Combine with existing images and previews
    setFiles(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }))
    setImagePreviews(prev => [...prev, ...newPreviews])
  } 
  else if (name === 'passbookImage') {
    setFiles(prev => ({
      ...prev,
      [name]: Array.from(selectedFiles)
    }))
  } 
  else {
    setFiles(prev => ({
      ...prev,
      [name]: selectedFiles[0]
    }))
  }
}

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.ownername) newErrors.ownername = "Owner name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = "Email is invalid";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6)
          newErrors.password = "Password must be at least 6 characters";
        if (!formData.number) newErrors.number = "Phone number is required";
        else if (!/^\d{10}$/.test(formData.number))
          newErrors.number = "Phone number must be 10 digits";
        break;
      case 2:
        if (!formData.businessname)
          newErrors.businessname = "Business name is required";
        if (!formData.businesslocation)
          newErrors.businesslocation = "Business location is required";
        if (!formData.storetype) newErrors.storetype = "Store type is required";
        if (!formData.address) newErrors.address = "Address is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.pincode) newErrors.pincode = "Pincode is required";
        break;
      case 3:
        if (!formData.bankDetails.bankName)
          newErrors.bank_bankName = "Bank name is required";
        if (!formData.bankDetails.accountNumber)
          newErrors.bank_accountNumber = "Account number is required";
        if (!formData.bankDetails.accountHolderName)
          newErrors.bank_accountHolderName = "Account holder name is required";
        if (!formData.bankDetails.ifscCode)
          newErrors.bank_ifscCode = "IFSC code is required";
        if (!files.storelogo) newErrors.storelogo = "Store logo is required";
        break;
      default:
        console.warn(`Unexpected step value: ${step}`);
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const removeImage = (index) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    // Remove the image and preview from state
    setFiles((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };
  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };


const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) {
        toast.error('Please fill all required fields correctly');
        return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Submitting your application...');

    try {
        const submitData = new FormData();

        // Append text fields
        Object.keys(formData).forEach((key) => {
            if (key === "bankDetails") {
                submitData.append(
                    "bankDetails",
                    JSON.stringify(formData.bankDetails)
                );
            } else {
                submitData.append(key, formData[key]);
            }
        });

        // Append files
        if (files.storelogo) submitData.append("storelogo", files.storelogo);
        if (files.license) submitData.append("license", files.license);

        files.images.forEach((file) => {
            submitData.append("images", file);
        });

        files.passbookImage.forEach((file) => {
            submitData.append("passbookImage", file);
        });

        const response = await becomeSellerApi(submitData);

        if (response.status === 200) {
            toast.update(toastId, {
                render: "Application submitted successfully!",
                type: "success",
                isLoading: false,
                autoClose: 5000,
                closeButton: true,
            });
            
            // Reset form
            setFormData({
                ownername: "",
                email: "",
                password: "",
                number: "",
                address: "",
                city: "",
                state: "",
                pincode: "",
                businessname: "",
                businesslocation: "",
                businesslandmark: "",
                description: "",
                storetype: "",
                bankDetails: {
                    bankName: "",
                    accountNumber: "",
                    accountHolderName: "",
                    ifscCode: "",
                },
                gstNumber: "",
            });
            setFiles({
                storelogo: null,
                license: null,
                images: [],
                passbookImage: [],
            });
            setCurrentStep(1);
        }
    } catch (error) {
        console.error("Error submitting application:", error);
        toast.update(toastId, {
            render: error.response?.data?.message || "Error submitting application. Please try again.",
            type: "error",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
        });
    } finally {
        setIsLoading(false);
    }
};



  const renderStep1 = () => (
    <div className="seller-registration-step">
      <h3 className="seller-step-title">Personal Information</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">Owner Name *</label>
          <input
            type="text"
            className={`form-control seller-form-control ${
              errors.ownername ? "is-invalid" : ""
            }`}
            name="ownername"
            value={formData.ownername}
            onChange={handleInputChange}
          />
          {errors.ownername && (
            <div className="invalid-feedback">{errors.ownername}</div>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">Email Address *</label>
          <input
            type="email"
            className={`form-control seller-form-control ${
              errors.email ? "is-invalid" : ""
            }`}
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">Password *</label>
          <input
            type="password"
            className={`form-control seller-form-control ${
              errors.password ? "is-invalid" : ""
            }`}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">Phone Number *</label>
          <input
            type="tel"
            className={`form-control seller-form-control ${
              errors.number ? "is-invalid" : ""
            }`}
            name="number"
            value={formData.number}
            onChange={handleInputChange}
          />
          {errors.number && (
            <div className="invalid-feedback">{errors.number}</div>
          )}
        </div>
      </div>
      <div className="mb-3">
        <label className="seller-form-label">Address *</label>
        <textarea
          className={`form-control seller-form-control ${
            errors.address ? "is-invalid" : ""
          }`}
          name="address"
          rows="3"
          value={formData.address}
          onChange={handleInputChange}
        ></textarea>
        {errors.address && (
          <div className="invalid-feedback">{errors.address}</div>
        )}
      </div>
      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="seller-form-label">City *</label>
          <input
            type="text"
            className={`form-control seller-form-control ${
              errors.city ? "is-invalid" : ""
            }`}
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
          {errors.city && <div className="invalid-feedback">{errors.city}</div>}
        </div>
        <div className="col-md-4 mb-3">
          <label className="seller-form-label">State *</label>
          <input
            type="text"
            className={`form-control seller-form-control ${
              errors.state ? "is-invalid" : ""
            }`}
            name="state"
            value={formData.state}
            onChange={handleInputChange}
          />
          {errors.state && (
            <div className="invalid-feedback">{errors.state}</div>
          )}
        </div>
        <div className="col-md-4 mb-3">
          <label className="seller-form-label">Pincode *</label>
          <input
            type="text"
            className={`form-control seller-form-control ${
              errors.pincode ? "is-invalid" : ""
            }`}
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
          />
          {errors.pincode && (
            <div className="invalid-feedback">{errors.pincode}</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="seller-registration-step">
      <h3 className="seller-step-title">Business Information</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">Business Name *</label>
          <input
            type="text"
            className={`form-control seller-form-control ${
              errors.businessname ? "is-invalid" : ""
            }`}
            name="businessname"
            value={formData.businessname}
            onChange={handleInputChange}
          />
          {errors.businessname && (
            <div className="invalid-feedback">{errors.businessname}</div>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">Store Type *</label>
          <input
          type="text"
            className={`form-control seller-form-control ${
              errors.storetype ? "is-invalid" : ""
            }`}
            name="storetype"
            value={formData.storetype}
            onChange={handleInputChange}
          />
          {errors.storetype && (
            <div className="invalid-feedback">{errors.storetype}</div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">Business Location *</label>
          <input
            type="text"
            className={`form-control seller-form-control ${
              errors.businesslocation ? "is-invalid" : ""
            }`}
            name="businesslocation"
            value={formData.businesslocation}
            onChange={handleInputChange}
          />
          {errors.businesslocation && (
            <div className="invalid-feedback">{errors.businesslocation}</div>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">Business Landmark</label>
          <input
            type="text"
            className="form-control seller-form-control"
            name="businesslandmark"
            value={formData.businesslandmark}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="seller-form-label">Business Description</label>
        <textarea
          className="form-control seller-form-control"
          name="description"
          rows="4"
          placeholder="Tell us about your business..."
          value={formData.description}
          onChange={handleInputChange}
        ></textarea>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="seller-registration-step">
      <h3 className="seller-step-title">Financial & Documents</h3>

      <div className="seller-section-divider">
        <h5 className="seller-section-title">Bank Details</h5>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">Bank Name *</label>
          <input
            type="text"
            className={`form-control seller-form-control ${
              errors.bank_bankName ? "is-invalid" : ""
            }`}
            name="bank_bankName"
            value={formData.bankDetails.bankName}
            onChange={handleInputChange}
          />
          {errors.bank_bankName && (
            <div className="invalid-feedback">{errors.bank_bankName}</div>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">Account Number *</label>
          <input
            type="text"
            className={`form-control seller-form-control ${
              errors.bank_accountNumber ? "is-invalid" : ""
            }`}
            name="bank_accountNumber"
            value={formData.bankDetails.accountNumber}
            onChange={handleInputChange}
          />
          {errors.bank_accountNumber && (
            <div className="invalid-feedback">{errors.bank_accountNumber}</div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">Account Holder Name *</label>
          <input
            type="text"
            className={`form-control seller-form-control ${
              errors.bank_accountHolderName ? "is-invalid" : ""
            }`}
            name="bank_accountHolderName"
            value={formData.bankDetails.accountHolderName}
            onChange={handleInputChange}
          />
          {errors.bank_accountHolderName && (
            <div className="invalid-feedback">
              {errors.bank_accountHolderName}
            </div>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">IFSC Code *</label>
          <input
            type="text"
            className={`form-control seller-form-control ${
              errors.bank_ifscCode ? "is-invalid" : ""
            }`}
            name="bank_ifscCode"
            value={formData.bankDetails.ifscCode}
            onChange={handleInputChange}
          />
          {errors.bank_ifscCode && (
            <div className="invalid-feedback">{errors.bank_ifscCode}</div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label className="seller-form-label">GST Number (Optional)</label>
        <input
          type="text"
          className="form-control seller-form-control"
          name="gstNumber"
          value={formData.gstNumber}
          onChange={handleInputChange}
        />
      </div>

      <div className="seller-section-divider">
        <h5 className="seller-section-title">Documents Upload</h5>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">Store Logo *</label>
          <input
            type="file"
            className={`form-control seller-file-input ${
              errors.storelogo ? "is-invalid" : ""
            }`}
            name="storelogo"
            accept="image/*"
            onChange={handleFileChange}
          />
          {errors.storelogo && (
            <div className="invalid-feedback">{errors.storelogo}</div>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">
            Business License (Optional)
          </label>
          <input
            type="file"
            className="form-control seller-file-input"
            name="license"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">Store Images *</label>
          <input
            type="file"
            className={`form-control seller-file-input ${
              errors.images ? "is-invalid" : ""
            }`}
            name="images"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          <small className="seller-file-help">
            Select multiple images (Ctrl+Click to select multiple)
          </small>

          {/* Image previews section */}
          {imagePreviews.length > 0 && (
            <div className="seller-image-previews mt-3">
              <h6 className="seller-preview-title">
                Selected Images ({imagePreviews.length}):
              </h6>
              <div className="seller-preview-container">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="seller-preview-item">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="seller-preview-image"
                    />
                    <button
                      type="button"
                      className="seller-remove-preview"
                      onClick={() => removeImage(index)}
                      aria-label="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {errors.images && (
            <div className="invalid-feedback">{errors.images}</div>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <label className="seller-form-label">Bank Passbook Images</label>
          <input
            type="file"
            className="form-control seller-file-input"
            name="passbookImage"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          <small className="seller-file-help">
            Upload front and back pages
          </small>
        </div>
      </div>
    </div>
  );

  return (
    <div className="seller-registration-container">
      <div className="container">
        <div className="seller-registration-wrapper">
          <div className="seller-header">
            <h1 className="seller-main-title">Become a Seller</h1>
          </div>

          <div className="seller-progress-wrapper">
            <div className="seller-progress">
              <div
                className="seller-progress-bar"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
            <div className="seller-step-indicators">
              <div
                className={`seller-step-indicator ${
                  currentStep >= 1 ? "active" : ""
                }`}
              >
                <span className="seller-step-number">1</span>
                <span className="seller-step-label">Personal Info</span>
              </div>
              <div
                className={`seller-step-indicator ${
                  currentStep >= 2 ? "active" : ""
                }`}
              >
                <span className="seller-step-number">2</span>
                <span className="seller-step-label">Business Info</span>
              </div>
              <div
                className={`seller-step-indicator ${
                  currentStep >= 3 ? "active" : ""
                }`}
              >
                <span className="seller-step-number">3</span>
                <span className="seller-step-label">Documents</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="seller-registration-form">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="seller-form-actions">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="btn seller-btn-secondary"
                  onClick={prevStep}
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  className="btn seller-btn-primary"
                  onClick={nextStep}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn seller-btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default BecomeSeller;

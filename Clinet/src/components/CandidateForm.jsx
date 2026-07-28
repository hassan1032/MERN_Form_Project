import React, { useState, useEffect } from "react";
import AddressSection from "./AddressSection";
import DocumentUpload from "./DocumentUpload";
import { validateForm } from "../validations/validation";
import { submitCandidateData } from "../services/api";

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  dateOfBirth: "",
  sameAsResidential: false,
  residentialAddress: {
    street1: "",
    street2: "",
  },
  permanentAddress: {
    street1: "",
    street2: "",
  },
};

const CandidateForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [documents, setDocuments] = useState([
    { fileName: "", fileType: "image" },
    { fileName: "", fileType: "image" },
  ]);
  const [files, setFiles] = useState([null, null]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: "" });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleAddressChange = (addressType, field, value) => {
    setFormData((prev) => {
      const updatedAddress = {
        ...prev[addressType],
        [field]: value,
      };
      const newState = {
        ...prev,
        [addressType]: updatedAddress,
      };
      if (addressType === "residentialAddress" && prev.sameAsResidential) {
        newState.permanentAddress = updatedAddress;
      }

      return newState;
    });

    const errorKey = `${addressType === "residentialAddress" ? "residential" : "permanent"}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: null }));
    }
  };

  const handleSameAddressToggle = (e) => {
    const isChecked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      sameAsResidential: isChecked,
      permanentAddress: isChecked
        ? { ...prev.residentialAddress }
        : { street1: "", street2: "" },
    }));

    if (isChecked) {
      setErrors((prev) => ({
        ...prev,
        permanentStreet1: null,
        permanentStreet2: null,
      }));
    }
  };

  const handleAddDocumentRow = () => {
    setDocuments((prev) => [...prev, { fileName: "", fileType: "image" }]);
    setFiles((prev) => [...prev, null]);
  };

  const handleRemoveDocumentRow = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
    
    if (errors.documentDetails) {
      setErrors((prev) => {
        const updatedDetails = [...prev.documentDetails];
        updatedDetails.splice(index, 1);
        return {
          ...prev,
          documentDetails: updatedDetails.length > 0 ? updatedDetails : null
        };
      });
    }
  };

  const handleDocumentMetadataChange = (index, field, value) => {
    setDocuments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });

    if (field === "fileType") {
      setFiles((prev) => {
        const updated = [...prev];
        updated[index] = null; 
        return updated;
      });
    }

    clearRowError(index, field);
  };

  const handleDocumentFileChange = (index, file) => {
    setFiles((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
    clearRowError(index, "file");
  };

  const clearRowError = (rowIndex, field) => {
    if (errors.documentDetails && errors.documentDetails[rowIndex]) {
      setErrors((prev) => {
        const updatedDetails = [...prev.documentDetails];
        if (updatedDetails[rowIndex]) {
          updatedDetails[rowIndex] = { ...updatedDetails[rowIndex], [field]: null };
          if (Object.values(updatedDetails[rowIndex]).every(val => !val)) {
            updatedDetails[rowIndex] = null;
          }
        }
        return {
          ...prev,
          documentDetails: updatedDetails.some(val => val) ? updatedDetails : null
        };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ success: null, message: "" });

    const validation = validateForm(formData, documents, files);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setSubmitStatus({ success: false, message: "Please resolve form validation errors before submitting." });
      
      setTimeout(() => {
        const firstError = document.querySelector(".input-error");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
          firstError.focus();
        }
      }, 50);

      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("email", formData.email);
      submitData.append("dateOfBirth", formData.dateOfBirth);
      submitData.append("sameAsResidential", formData.sameAsResidential.toString());
      submitData.append("residentialAddress", JSON.stringify(formData.residentialAddress));
      submitData.append("permanentAddress", JSON.stringify(formData.permanentAddress));
      submitData.append("documents", JSON.stringify(documents));

      files.forEach((file) => {
        submitData.append("files", file);
      });

      const response = await submitCandidateData(submitData);

      setSubmitStatus({ success: true, message: response.message || "Form submitted successfully!" });
      setFormData(initialFormState);
      setDocuments([
        { fileName: "", fileType: "image" },
        { fileName: "", fileType: "image" },
      ]);
      setFiles([null, null]);
      setErrors({});
      
      // Smooth scroll to top to show the green success alert banner
      setTimeout(() => {
        const successAlert = document.getElementById("success-alert");
        if (successAlert) {
          successAlert.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    } catch (error) {
      console.error("Submission failed:", error);
      const backendMessage = error.response?.data?.message || "An error occurred during submission. Please try again.";
      setSubmitStatus({ success: false, message: backendMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="candidate-form" onSubmit={handleSubmit} noValidate>
      <h1 className="form-title">MERN STACK MACHINE TEST</h1>
      
      {submitStatus.message && (
        <div 
          id={submitStatus.success ? "success-alert" : "error-alert"}
          className={`status-alert ${submitStatus.success ? "status-success" : "status-error"}`}
        >
          <div className={submitStatus.success === false ? "status-alert-title" : ""}>
            {submitStatus.message}
          </div>
          {submitStatus.success === false && Object.keys(errors).length > 0 && (
            <ul className="status-alert-list">
              {Object.entries(errors).map(([key, value]) => {
                if (key === "documentDetails" && Array.isArray(value)) {
                  return value.map((docErr, idx) => {
                    if (!docErr) return null;
                    return Object.entries(docErr).map(([subKey, subVal]) => {
                      if (!subVal) return null;
                      return (
                        <li key={`${idx}-${subKey}`}>
                          Document #{idx + 1}: {subVal}
                        </li>
                      );
                    });
                  });
                }
                if (typeof value !== "string") return null;
                return <li key={key}>{value}</li>;
              })}
            </ul>
          )}
        </div>
      )}

      {/* 1. Personal Information */}
      <div className="form-card">
        <h3 className="section-title">Personal Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First Name <span className="required-star">*</span></label>
            <input
              type="text"
              className={`form-input ${errors.firstName ? "input-error" : ""}`}
              placeholder="Enter your first name..."
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Last Name <span className="required-star">*</span></label>
            <input
              type="text"
              className={`form-input ${errors.lastName ? "input-error" : ""}`}
              placeholder="Enter your last name..."
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">E-mail <span className="required-star">*</span></label>
            <input
              type="email"
              className={`form-input ${errors.email ? "input-error" : ""}`}
              placeholder="ex: myname@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Date of Birth <span className="required-star">*</span></label>
            <input
              type="date"
              className={`form-input ${errors.dateOfBirth ? "input-error" : ""}`}
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            />
            <span className="helper-text">(Min. age should be 18 Years)</span>
            {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
          </div>
        </div>
      </div>

      {/* 2. Addresses Row */}
      <div className="addresses-row">
        <AddressSection
          title="Residential Address"
          street1Value={formData.residentialAddress.street1}
          street2Value={formData.residentialAddress.street2}
          onStreet1Change={(val) => handleAddressChange("residentialAddress", "street1", val)}
          onStreet2Change={(val) => handleAddressChange("residentialAddress", "street2", val)}
          street1Error={errors.residentialStreet1}
          street2Error={errors.residentialStreet2}
          required={true}
        />

        <AddressSection
          title="Permanent Address"
          street1Value={formData.permanentAddress.street1}
          street2Value={formData.permanentAddress.street2}
          onStreet1Change={(val) => handleAddressChange("permanentAddress", "street1", val)}
          onStreet2Change={(val) => handleAddressChange("permanentAddress", "street2", val)}
          street1Error={errors.permanentStreet1}
          street2Error={errors.permanentStreet2}
          disabled={formData.sameAsResidential}
          required={!formData.sameAsResidential}
          extraHeaderElement={
            <div className="checkbox-wrapper-header">
              <label className="checkbox-label-header">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={formData.sameAsResidential}
                  onChange={handleSameAddressToggle}
                />
                <span className="checkbox-custom"></span>
                Same as Residential
              </label>
            </div>
          }
        />
      </div>

      {/* 4. Document Upload */}
      <DocumentUpload
        documents={documents}
        files={files}
        onAddRow={handleAddDocumentRow}
        onRemoveRow={handleRemoveDocumentRow}
        onRowChange={handleDocumentMetadataChange}
        onFileChange={handleDocumentFileChange}
        errors={errors.documentDetails || errors.documents}
      />

      {/* Submit Button */}
      <div className="submit-wrapper">
        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loader-wrapper">
              <span className="loader"></span> Submitting...
            </span>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
};

export default CandidateForm;

import React from "react";

const AddressSection = ({
  title,
  street1Value,
  street2Value,
  onStreet1Change,
  onStreet2Change,
  street1Error,
  street2Error,
  disabled = false,
  required = false,
  extraHeaderElement = null
}) => {
  return (
    <div className="address-card">
      <div className="address-header">
        <h3 className="section-title">
          {title} {required && <span className="required-star">*</span>}
        </h3>
        {extraHeaderElement}
      </div>
      <div className={`address-grid ${disabled ? "disabled-grid" : ""}`}>
        <div className="form-group">
          <label className="form-label">
            Street 1 {required && !disabled && <span className="required-star">*</span>}
          </label>
          <input
            type="text"
            className={`form-input ${street1Error ? "input-error" : ""}`}
            placeholder="Enter street 1..."
            value={street1Value}
            onChange={(e) => onStreet1Change(e.target.value)}
            disabled={disabled}
          />
          {street1Error && <span className="error-message">{street1Error}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Street 2 {required && !disabled && <span className="required-star">*</span>}
          </label>
          <input
            type="text"
            className={`form-input ${street2Error ? "input-error" : ""}`}
            placeholder="Enter street 2..."
            value={street2Value}
            onChange={(e) => onStreet2Change(e.target.value)}
            disabled={disabled}
          />
          {street2Error && <span className="error-message">{street2Error}</span>}
        </div>
      </div>
    </div>
  );
};

export default AddressSection;

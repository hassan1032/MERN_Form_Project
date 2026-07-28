import React from "react";

const DocumentUpload = ({
  documents,
  files,
  onAddRow,
  onRemoveRow,
  onRowChange,
  onFileChange,
  errors
}) => {
  return (
    <div className="documents-card">
      <h3 className="section-title">
        Upload Documents <span className="required-star">*</span>
        <span className="section-subtitle">(Minimum 2 documents required)</span>
      </h3>

      {errors && typeof errors === "string" && (
        <div className="error-banner">{errors}</div>
      )}

      <div className="documents-list">
        {documents.map((doc, index) => {
          const rowErrors = errors && Array.isArray(errors) ? errors[index] : null;

          return (
            <div className="document-row-wrapper" key={index}>
              <div className="document-row">
                {/* File Name Input */}
                <div className="form-group doc-name-group">
                  <label className="form-label doc-label">File Name <span className="required-star">*</span></label>
                  <input
                    type="text"
                    className={`form-input ${rowErrors?.fileName ? "input-error" : ""}`}
                    placeholder="e.g., Aadhar Card"
                    value={doc.fileName}
                    onChange={(e) => onRowChange(index, "fileName", e.target.value)}
                  />
                  {rowErrors?.fileName && (
                    <span className="error-message">{rowErrors.fileName}</span>
                  )}
                </div>

                {/* File Type Dropdown */}
                <div className="form-group doc-type-group">
                  <label className="form-label doc-label">Type of File <span className="required-star">*</span></label>
                  <div className="select-wrapper">
                    <select
                      className={`form-input ${rowErrors?.fileType ? "input-error" : ""}`}
                      value={doc.fileType}
                      onChange={(e) => onRowChange(index, "fileType", e.target.value)}
                    >
                      <option value="image">image</option>
                      <option value="pdf">pdf</option>
                    </select>
                    <div className="select-arrow"></div>
                  </div>
                  {rowErrors?.fileType && (
                    <span className="error-message">{rowErrors.fileType}</span>
                  )}
                </div>

                {/* Upload Button */}
                <div className="form-group doc-upload-group">
                  <label className="form-label doc-label">Upload Document <span className="required-star">*</span></label>
                  <input
                    type="file"
                    id={`file-input-${index}`}
                    style={{ display: "none" }}
                    accept="image/*,application/pdf"
                    onChange={(e) => onFileChange(index, e.target.files[0])}
                  />
                  <button
                    type="button"
                    className={`upload-btn ${rowErrors?.file ? "btn-error" : ""} ${files[index] ? "file-selected" : ""}`}
                    onClick={() => document.getElementById(`file-input-${index}`)?.click()}
                  >
                    <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                    <span className="upload-btn-text">
                      {files[index] ? files[index].name : "Upload Document"}
                    </span>
                  </button>
                  {rowErrors?.file && (
                    <span className="error-message">{rowErrors.file}</span>
                  )}
                </div>

                {/* Dynamic Action Buttons */}
                <div className="doc-action-group">
                  <label className="form-label doc-label empty-label">&nbsp;</label>
                  {index === 0 ? (
                    <button
                      type="button"
                      className="action-btn add-btn"
                      onClick={onAddRow}
                      title="Add Document"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="action-btn remove-btn"
                      onClick={() => onRemoveRow(index)}
                      title="Delete Row"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentUpload;

export const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return NaN;

  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

export const validateForm = (formData, documents, files) => {
  const errors = {};

  if (!formData.firstName || !formData.firstName.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!formData.lastName || !formData.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = "Email is required.";
  } else {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
  }

  if (!formData.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required.";
  } else {
    const age = calculateAge(formData.dateOfBirth);
    if (isNaN(age)) {
      errors.dateOfBirth = "Invalid Date of Birth format.";
    } else if (age < 18) {
      errors.dateOfBirth = "Candidate must be at least 18 years old.";
    }
  }

  if (!formData.residentialAddress.street1 || !formData.residentialAddress.street1.trim()) {
    errors.residentialStreet1 = "Residential Street 1 is required.";
  }
  if (!formData.residentialAddress.street2 || !formData.residentialAddress.street2.trim()) {
    errors.residentialStreet2 = "Residential Street 2 is required.";
  }

  if (!formData.sameAsResidential) {
    if (!formData.permanentAddress.street1 || !formData.permanentAddress.street1.trim()) {
      errors.permanentStreet1 = "Permanent Street 1 is required.";
    }
    if (!formData.permanentAddress.street2 || !formData.permanentAddress.street2.trim()) {
      errors.permanentStreet2 = "Permanent Street 2 is required.";
    }
  }

  if (!documents || documents.length < 2) {
    errors.documents = "Minimum two documents are required.";
  } else {
    const docErrors = [];
    documents.forEach((doc, index) => {
      const file = files[index];
      const docError = {};

      if (!doc.fileName || !doc.fileName.trim()) {
        docError.fileName = "Document name is required.";
      }

      if (!doc.fileType) {
        docError.fileType = "File type is required.";
      }

      if (!file) {
        docError.file = "Please upload a document file.";
      } else {
        const isImage = file.type.startsWith("image/");
        const isPdf = file.type === "application/pdf";

        if (doc.fileType === "image" && !isImage) {
          docError.file = "Mismatched type: Uploaded file is not an image.";
        } else if (doc.fileType === "pdf" && !isPdf) {
          docError.file = "Mismatched type: Uploaded file is not a PDF.";
        }
      }

      if (Object.keys(docError).length > 0) {
        docErrors[index] = docError;
      }
    });

    if (docErrors.length > 0) {
      errors.documentDetails = docErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

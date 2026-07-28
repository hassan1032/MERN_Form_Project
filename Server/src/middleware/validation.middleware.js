import { body, validationResult } from "express-validator";
import fs from "fs";
import calculateAge from "../utils/calculateAge.js";

const deleteFiles = (files) => {
    if (files && files.length > 0) {
        files.forEach(file => {
            if (file.path && fs.existsSync(file.path)) {
                try {
                    fs.unlinkSync(file.path);
                } catch (err) {
                    console.error("Failed to delete temp file:", err.message);
                }
            }
        });
    }
};

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        deleteFiles(req.files);
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        });
    }
    next();
};

export const candidateValidationRules = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required."),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required."),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email address.")
        .normalizeEmail(),

    body("dateOfBirth")
        .custom((value, { req }) => {
            const dobVal = req.body.dateOfBirth || req.body.dob;
            if (!dobVal) {
                throw new Error("Date of birth is required.");
            }
            const age = calculateAge(dobVal);
            if (isNaN(age)) {
                throw new Error("Invalid Date of Birth format.");
            }
            if (age < 18) {
                throw new Error("Candidate must be at least 18 years old.");
            }
            return true;
        }),

    body("residentialAddress")
        .notEmpty()
        .withMessage("Residential address is required.")
        .custom((value) => {
            let addr = value;
            if (typeof addr === "string") {
                try {
                    addr = JSON.parse(addr);
                } catch (err) {
                    throw new Error("Invalid residentialAddress format.");
                }
            }
            if (!addr || !addr.street1 || !addr.street2 || !addr.street1.trim() || !addr.street2.trim()) {
                throw new Error("Residential Address (Street 1 and Street 2) is mandatory.");
            }
            return true;
        }),

    body("sameAsResidential")
        .custom((value, { req }) => {
            const same = value === true || value === "true";
            if (!same) {
                let perm = req.body.permanentAddress;
                if (typeof perm === "string" && perm.trim() !== "") {
                    try {
                        perm = JSON.parse(perm);
                    } catch (err) {
                        throw new Error("Invalid permanentAddress format.");
                    }
                }
                if (!perm || !perm.street1 || !perm.street2 || !perm.street1.trim() || !perm.street2.trim()) {
                    throw new Error("Permanent address is mandatory when 'Same as Residential' is unchecked.");
                }
            }
            return true;
        }),

    body("documents")
        .notEmpty()
        .withMessage("Documents metadata is required.")
        .custom((value, { req }) => {
            let docs = value;
            if (typeof docs === "string") {
                try {
                    docs = JSON.parse(docs);
                } catch (err) {
                    throw new Error("Invalid documents metadata format.");
                }
            }

            if (!docs || !Array.isArray(docs) || docs.length < 2) {
                throw new Error("Minimum two documents are required.");
            }

            const files = req.files;
            if (!files || files.length < 2) {
                throw new Error("Please upload at least two document files.");
            }

            if (files.length !== docs.length) {
                throw new Error(`Uploaded file count (${files.length}) does not match documents metadata count (${docs.length}).`);
            }

            for (let i = 0; i < docs.length; i++) {
                const doc = docs[i];
                const file = files[i];

                if (!doc.fileName || !doc.fileName.trim()) {
                    throw new Error(`Document name is required for document at index ${i + 1}.`);
                }

                if (!doc.fileType || !["image", "pdf"].includes(doc.fileType)) {
                    throw new Error(`Invalid fileType for document at index ${i + 1}. Must be 'image' or 'pdf'.`);
                }

                const isImage = file.mimetype.startsWith("image/");
                const isPdf = file.mimetype === "application/pdf";

                if (doc.fileType === "image" && !isImage) {
                    throw new Error(`File type mismatch: Document '${doc.fileName}' must be an image.`);
                }

                if (doc.fileType === "pdf" && !isPdf) {
                    throw new Error(`File type mismatch: Document '${doc.fileName}' must be a PDF.`);
                }
            }

            return true;
        })
];

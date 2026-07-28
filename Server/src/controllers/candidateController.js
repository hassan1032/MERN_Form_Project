import fs from "fs";
import Candidate from "../models/candidate.model.js";
import Document from "../models/document.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

const deleteFiles = (files) => {
    if (files && files.length > 0) {
        files.forEach(file => {
            if (file.path && fs.existsSync(file.path)) {
                try {
                    fs.unlinkSync(file.path);
                } catch (err) {
                    console.error("Failed to delete temporary file:", err.message);
                }
            }
        });
    }
};

export const submitCandidate = async (req, res) => {
    const uploadedFiles = req.files;
    try {
        let { firstName, lastName, email, dateOfBirth, dob, residentialAddress, sameAsResidential, permanentAddress,documents } = req.body;
        const dobValue = new Date(dateOfBirth || dob);
        residentialAddress = typeof residentialAddress === "string" ? JSON.parse(residentialAddress) : residentialAddress;
        sameAsResidential = sameAsResidential === true || sameAsResidential === "true";
        if (sameAsResidential) {
            permanentAddress = {
                street1: residentialAddress.street1,
                street2: residentialAddress.street2
            };
        } else {
            permanentAddress = typeof permanentAddress === "string" ? JSON.parse(permanentAddress) : permanentAddress;
        }
        documents = typeof documents === "string" ? JSON.parse(documents) : documents;
        const existingCandidate = await Candidate.findOne({ email });
        if (existingCandidate) {
            deleteFiles(uploadedFiles);
            return errorResponse(res, 400, "Email is already registered.");
        }

        const newCandidate = new Candidate({ firstName, lastName, email, dateOfBirth: dobValue, residentialAddress, sameAsResidential,   permanentAddress });
        await newCandidate.save();
        const savedDocuments = [];
        for (let i = 0; i < documents.length; i++) {
            const docMeta = documents[i];
            const file = uploadedFiles[i];

            const newDoc = new Document({
                candidate: newCandidate._id,
                fileName: docMeta.fileName,
                fileType: docMeta.fileType,
                originalName: file.originalname,
                fileUrl: `/uploads/${file.filename}`,
                fileSize: file.size,
                mimeType: file.mimetype
            });
            await newDoc.save();
            savedDocuments.push(newDoc);
        }
        return successResponse(res, 201, "Candidate documents submitted successfully!", { candidate: newCandidate,  documents: savedDocuments  });

    } catch (error) {
        deleteFiles(uploadedFiles);
        console.error("Error in submitCandidate controller:", error);
        return errorResponse(res, 500, `Internal server error: ${error.message}`);
    }
};

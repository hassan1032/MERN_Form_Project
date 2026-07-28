import express from "express";
import upload from "../middleware/upload.middleware.js";
import { submitCandidate } from "../controllers/candidateController.js";
import { candidateValidationRules, handleValidationErrors } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post(
    "/submit",
    upload.any(),
    candidateValidationRules,
    handleValidationErrors,
    submitCandidate
);

export default router;

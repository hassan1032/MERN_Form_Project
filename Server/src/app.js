import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import candidateRoutes from "./routes/candidateRoutes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.get("/health", (req, res) => {
    res.status(200).json({ success: true, message: "Backend Server is running!" });
});
app.use("/api/candidate", candidateRoutes);

app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "An unexpected error occurred on the server."
    });
});

export default app;
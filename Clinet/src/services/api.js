import axios from "axios";

// Environment Switching Configuration:
// 1. FOR LIVE DEPLOYMENT: VITE_API_URL should be set in Netlify dashboard (e.g., https://mern-form-project-ot48.onrender.com)
// 2. FOR LOCAL DEVELOPMENT: If VITE_API_URL is empty, Vite proxy will redirect "/api" to http://localhost:5000
const BACKEND_URL = import.meta.env.VITE_API_URL || "";

const API_BASE_URL = BACKEND_URL
  ? `${BACKEND_URL}/api/candidate`
  : "/api/candidate";

export const submitCandidateData = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/submit`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

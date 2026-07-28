import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/candidate`
  : "/api/candidate";

export const submitCandidateData = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/submit`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

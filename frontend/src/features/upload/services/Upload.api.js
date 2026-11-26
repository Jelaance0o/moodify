import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export async function uploadSong(formData) {
  const response = await api.post("/api/songs", formData);
  return response.data;
}
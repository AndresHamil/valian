import axios from "axios";
import { getSessionToken } from "../session/auth";

const api = axios.create({
  baseURL: "",
});

api.interceptors.request.use((config) => {
  const token = getSessionToken();
  if (token && config.headers) {
    // Normalizamos a 'Bearer <token>'
    config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }

  return config;
});

export default api;

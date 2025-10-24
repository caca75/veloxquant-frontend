// frontend/src/api.js
import axios from "axios";

/**
 * Base URL robuste :
 * - lit REACT_APP_BACKEND_URL s'il est défini
 * - sinon bascule sur http://127.0.0.1:8001
 * - nettoie les / en trop
 */
const RAW = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8001").trim();
const BASE = RAW.replace(/\/+$/, "") + "/api";

const api = axios.create({
  baseURL: BASE,
  timeout: 30000, // 30s pour éviter les faux "échecs"
});

// Ajout automatique du token si présent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

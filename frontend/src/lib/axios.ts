import useAuth from "@/stores/useAuth";
import axios from "axios";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(
  (config) => {
    const { token } = useAuth.getState();
    if (!!token && !config.url?.startsWith("/login")) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

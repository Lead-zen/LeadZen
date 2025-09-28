import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // send cookies automatically
});

// Response interceptor: auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired, try refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/authenticate/refresh"); // refresh sets new cookies
        return api(originalRequest); // retry original request
      } catch (err) {
        console.error("Refresh failed", err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

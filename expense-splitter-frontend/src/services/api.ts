import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { auth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - automatically add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; statusCode?: number }>) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      auth.clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    // Extract error message
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Bir hata oluştu";

    return Promise.reject(new Error(errorMessage));
  }
);

export const api = {
  get: <T>(endpoint: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(endpoint, config).then((res) => res.data),

  post: <T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(endpoint, data, config).then((res) => res.data),

  put: <T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(endpoint, data, config).then((res) => res.data),

  patch: <T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(endpoint, data, config).then((res) => res.data),

  delete: <T>(endpoint: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(endpoint, config).then((res) => res.data),
};

export default axiosInstance;

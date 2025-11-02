// services/packageService.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token if needed
api.interceptors.request.use(
  (config) => {
    // You can add authentication tokens here if needed
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error("API Error:", error.response.status, error.response.data);

      switch (error.response.status) {
        case 401:
          console.error("Unauthorized - Please login again");
          // You can redirect to login page here
          break;
        case 403:
          console.error("Forbidden - You do not have permission");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error - Please try again later");
          break;
        default:
          console.error("Unexpected error occurred");
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network error - Please check your connection");
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export const packageService = {
  /**
   * Create a new package
   * @param {Object} data - Package data
   * @returns {Promise} API response
   */
  create: async (data) => {
    try {
      console.log(data);
      
      const response = await api.post("/packages", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all packages with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 20)
   * @returns {Promise} API response with packages and meta data
   */
  getAll: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/packages?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single package by ID
   * @param {string|number} id - Package ID
   * @returns {Promise} API response with package data
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/packages/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update package by ID
   * @param {string|number} id - Package ID
   * @param {Object} data - Updated package data
   * @returns {Promise} API response
   */
  update: async (id, data) => {
    try {
      const response = await api.put(`/packages/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete package by ID
   * @param {string|number} id - Package ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/packages/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search packages by various criteria
   * @param {Object} criteria - Search criteria
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} API response with search results
   */
  search: async (criteria, page = 1, limit = 20) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...criteria,
      });
      const response = await api.get(`/packages/search?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get package statistics
   * @returns {Promise} API response with statistics
   */
  getStats: async () => {
    try {
      const response = await api.get("/packages/stats");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Utility functions for package data validation
export const packageUtils = {
  /**
   * Validate package data before submission
   * @param {Object} data - Package data to validate
   * @returns {Object} Validation result { isValid: boolean, errors: array }
   */
  validatePackage: (data) => {
    const errors = [];

    // Required fields validation
    if (!data.receiverName?.trim()) {
      errors.push("نام گیرنده الزامی است");
    }

    if (!data.receiverPhone?.trim()) {
      errors.push("شماره تماس گیرنده الزامی است");
    }

    if (!data.senderName?.trim()) {
      errors.push("نام فرستنده الزامی است");
    }

    if (!data.senderPhone?.trim()) {
      errors.push("شماره تماس فرستنده الزامی است");
    }

    if (!data.goodWeight || data.goodWeight <= 0) {
      errors.push("وزن بسته باید بیشتر از صفر باشد");
    }

    // Email validation (if provided)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.receiverEmail && !emailRegex.test(data.receiverEmail)) {
      errors.push("ایمیل گیرنده معتبر نیست");
    }

    if (data.senderEmail && !emailRegex.test(data.senderEmail)) {
      errors.push("ایمیل فرستنده معتبر نیست");
    }

    // Phone number basic validation (if needed)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (data.receiverPhone && !phoneRegex.test(data.receiverPhone)) {
      errors.push("شماره تماس گیرنده معتبر نیست");
    }

    if (data.senderPhone && !phoneRegex.test(data.senderPhone)) {
      errors.push("شماره تماس فرستنده معتبر نیست");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Calculate total cash based on weight and price per kg
   * @param {number} weight - Weight in kg
   * @param {number} pricePerKg - Price per kg
   * @param {number} piece - Number of pieces
   * @returns {number} Calculated total cash
   */
  calculateTotalCash: (weight, pricePerKg, piece = 1) => {
    return (weight * pricePerKg * piece).toFixed(2);
  },

  /**
   * Format package data for display
   * @param {Object} packageData - Raw package data
   * @returns {Object} Formatted package data
   */
  formatForDisplay: (packageData) => {
    return {
      ...packageData,
      goodWeight: packageData.goodWeight
        ? `${packageData.goodWeight} kg`
        : "0 kg",
      totalCash: packageData.totalCash ? `$${packageData.totalCash}` : "$0",
      goodsValue: packageData.goodsValue ? `$${packageData.goodsValue}` : "$0",
      createdAt: packageData.createdAt
        ? new Date(packageData.createdAt).toLocaleDateString("fa-IR")
        : "N/A",
    };
  },
};

export default packageService;

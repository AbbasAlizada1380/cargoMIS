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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);

      switch (error.response.status) {
        case 401:
          console.error("Unauthorized - Please login again");
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
      console.error("Network error - Please check your connection");
    } else {
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export const packageService = {
  /**
   * Create a new package
   */
  create: async (data) => {
    try {
      const response = await api.post("/packages", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all packages with pagination
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
   * Search packages by criteria
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
   */
  getStats: async () => {
    try {
      const response = await api.get("/packages/stats");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * ✅ Update only the location of a package
   * @param {number|string} packageId
   * @param {string} location
   * @returns {Promise<Object>} API response
   */
  updateLocation: async (packageId, location) => {
    try {
      const response = await api.patch(`/packages/${packageId}`, {
        location,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating package location:", error);
      throw error;
    }
  },
  updateBulkLocations: async (packageIds, location) => {
    try {
      const promises = packageIds.map((packageId) =>
        api.patch(`/packages/${packageId}`, { location })
      );
      const results = await Promise.all(promises);
      return {
        success: true,
        message: `${packageIds.length} بسته با موفقیت به‌روزرسانی شدند`,
        data: results.map((r) => r.data),
      };
    } catch (error) {
      console.error("Error updating bulk package locations:", error);
      return {
        success: false,
        message: "خطا در به‌روزرسانی موقعیت بسته‌ها",
      };
    }
  },
};

// Utility functions for package data validation
export const packageUtils = {
  validatePackage: (data) => {
    const errors = [];

    if (!data.receiverName?.trim()) errors.push("نام گیرنده الزامی است");
    if (!data.receiverPhone?.trim())
      errors.push("شماره تماس گیرنده الزامی است");
    if (!data.senderName?.trim()) errors.push("نام فرستنده الزامی است");
    if (!data.senderPhone?.trim()) errors.push("شماره تماس فرستنده الزامی است");
    if (!data.goodWeight || data.goodWeight <= 0)
      errors.push("وزن بسته باید بیشتر از صفر باشد");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.receiverEmail && !emailRegex.test(data.receiverEmail))
      errors.push("ایمیل گیرنده معتبر نیست");
    if (data.senderEmail && !emailRegex.test(data.senderEmail))
      errors.push("ایمیل فرستنده معتبر نیست");

    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (data.receiverPhone && !phoneRegex.test(data.receiverPhone))
      errors.push("شماره تماس گیرنده معتبر نیست");
    if (data.senderPhone && !phoneRegex.test(data.senderPhone))
      errors.push("شماره تماس فرستنده معتبر نیست");

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  calculateTotalCash: (weight, pricePerKg, piece = 1) => {
    return (weight * pricePerKg * piece).toFixed(2);
  },

  formatForDisplay: (packageData) => ({
    ...packageData,
    goodWeight: packageData.goodWeight
      ? `${packageData.goodWeight} kg`
      : "0 kg",
    totalCash: packageData.totalCash ? `$${packageData.totalCash}` : "$0",
    goodsValue: packageData.goodsValue ? `$${packageData.goodsValue}` : "$0",
    createdAt: packageData.createdAt
      ? new Date(packageData.createdAt).toLocaleDateString("fa-IR")
      : "N/A",
  }),
};

export default packageService;

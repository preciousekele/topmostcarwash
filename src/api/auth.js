import axios from "axios";

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {       
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} API response
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post("/api/auth/login", credentials);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      throw new Error(message);
    }
  },

  /**
   * Register new user
   * @param {Object} userData - { email, password, name, role, branchId }
   * @returns {Promise} API response
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      throw new Error(message);
    }
  },

  /**
   * Logout user
   * @returns {Promise} API response
   */
  logout: async () => {
    try {
      const response = await apiClient.post("/auth/logout");
      return response.data;
    } catch (error) {
      // Continue with logout even if API call fails
      console.error("Logout API error:", error);
      return { success: true, message: "Logged out" };
    }
  },

  /**
   * Get current user
   * @returns {Promise} API response
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/api/auth/me");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch user data.";
      throw new Error(message);
    }
  },

  /**
   * Change password
   * @param {Object} passwords - { currentPassword, newPassword }
   * @returns {Promise} API response
   */
  changePassword: async (passwords) => {
    try {
      const response = await apiClient.put("/auth/change-password", passwords);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to change password.";
      throw new Error(message);
    }
  },

  /**
   * Get available branches
   * @returns {Promise} API response
   */
  getBranches: async () => {
    try {
      const response = await apiClient.get("/auth/branches");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch branches.";
      throw new Error(message);
    }
  },

  /**
   * Forgot password
   * @param {string} email
   * @returns {Promise} API response
   */
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to process request.";
      throw new Error(message);
    }
  },

  /**
   * Reset password
   * @param {Object} data - { token, newPassword }
   * @returns {Promise} API response
   */
  resetPassword: async (data) => {
    try {
      const response = await apiClient.post("/auth/reset-password", data);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to reset password.";
      throw new Error(message);
    }
  },
};

// Export the axios instance for use in other API files
export const api = apiClient;

export default authAPI;

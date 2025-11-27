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
    // CRITICAL FIX: Only redirect to login if we're NOT already on the login page
    // and if we have a token (meaning user was authenticated but token expired)
    if (error.response?.status === 401) {
      const token = localStorage.getItem("token");
      const isLoginPage = window.location.pathname === "/login";
      
      // Only redirect if user was authenticated and is not on login page
      if (token && !isLoginPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("auth-storage");
        window.location.href = "/login";
      }
      // If on login page, just reject the error so it can be handled by the login form
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
      const data = response.data;
      
      console.log('Login API response:', data); // Debug log
      
      // Check if backend returned success: false
      if (data.success === false) {
        const error = new Error(data.message || "Invalid email or password");
        error.isAuthError = true;
        throw error;
      }
      
      // Validate we have required data
      if (!data.data?.user || !data.data?.token) {
        const error = new Error('Invalid response from server');
        error.isAuthError = true;
        throw error;
      }
      
      return data;
    } catch (error) {
      // Handle 401 errors from backend
      if (error.response?.status === 401) {
        const message = error.response.data?.message || "Invalid email or password";
        const authError = new Error(message);
        authError.isAuthError = true;
        throw authError;
      }
      
      // If it's already our custom error, just re-throw
      if (error.isAuthError) {
        throw error;
      }
      
      // Handle other errors
      const message = error.response?.data?.message || error.message || "Login failed. Please try again.";
      const newError = new Error(message);
      newError.isAuthError = true;
      throw newError;
    }
  },

  /**
   * Register new user
   * @param {Object} userData - { email, password, name, role, branchId }
   * @returns {Promise} API response
   */
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    const data = response.data;
    
    if (data.success === false) {
      const error = new Error(data.message || "Registration failed");
      error.isAuthError = true;
      throw error;
    }
    
    return data;
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
    const response = await apiClient.get("/api/auth/me");
    return response.data;
  },

  /**
   * Change password
   * @param {Object} passwords - { currentPassword, newPassword }
   * @returns {Promise} API response
   */
  changePassword: async (passwords) => {
    const response = await apiClient.put("/auth/change-password", passwords);
    const data = response.data;
    
    if (data.success === false) {
      const error = new Error(data.message || "Failed to change password");
      error.isAuthError = true;
      throw error;
    }
    
    return data;
  },

  /**
   * Get available branches
   * @returns {Promise} API response
   */
  getBranches: async () => {
    const response = await apiClient.get("/auth/branches");
    return response.data;
  },

  /**
   * Forgot password
   * @param {string} email
   * @returns {Promise} API response
   */
  forgotPassword: async (email) => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    const data = response.data;
    
    if (data.success === false) {
      const error = new Error(data.message || "Failed to process request");
      error.isAuthError = true;
      throw error;
    }
    
    return data;
  },

  /**
   * Reset password
   * @param {Object} data - { token, newPassword }
   * @returns {Promise} API response
   */
  resetPassword: async (data) => {
    const response = await apiClient.post("/auth/reset-password", data);
    const responseData = response.data;
    
    if (responseData.success === false) {
      const error = new Error(responseData.message || "Failed to reset password");
      error.isAuthError = true;
      throw error;
    }
    
    return responseData;
  },
};

// Export the axios instance for use in other API files
export const api = apiClient;

export default authAPI;
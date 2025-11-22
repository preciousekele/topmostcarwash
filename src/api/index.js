import apiClient from './client';

export const authAPI = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} Response with user and token
   */
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response;
  },

  /**
   * Register new user
   * @param {Object} userData - { email, password, name, role }
   * @returns {Promise} Response with user and token
   */
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response;
  },

  /**
   * Get current logged in user
   * @returns {Promise} Response with user data
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response;
  },

  /**
   * Logout user
   * @returns {Promise} Response
   */
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response;
  },

  /**
   * Change password
   * @param {Object} passwords - { currentPassword, newPassword }
   * @returns {Promise} Response
   */
  changePassword: async (passwords) => {
    const response = await apiClient.put('/auth/change-password', passwords);
    return response;
  },
};

export default authAPI;
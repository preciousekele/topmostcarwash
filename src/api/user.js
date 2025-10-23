import { api } from './index';

export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  
  updateProfile: async (updates) => {
    const response = await api.put('/user/profile', updates);
    return response.data;
  },
  
  getPreferences: async () => {
    const response = await api.get('/user/preferences');
    return response.data;
  },
  
  updatePreferences: async (preferences) => {
    const response = await api.put('/user/preferences', preferences);
    return response.data;
  },
  
  getNotifications: async () => {
    const response = await api.get('/user/notifications');
    return response.data;
  }
};
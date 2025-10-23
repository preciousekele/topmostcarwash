import { create } from 'zustand';

export const useUserStore = create((set, get) => ({
  // State
  profile: null,
  preferences: {},
  notifications: [],
  isUpdating: false,

  // Actions
  setProfile: (profile) => set({ profile }),
  
  setPreferences: (preferences) => set({ preferences }),
  
  updateProfile: (updates) => {
    const currentProfile = get().profile;
    set({ 
      profile: { ...currentProfile, ...updates },
      isUpdating: false 
    });
  },
  
  setUpdating: (isUpdating) => set({ isUpdating }),
  
  addNotification: (notification) => {
    const notifications = get().notifications;
    set({ 
      notifications: [notification, ...notifications] 
    });
  },
  
  removeNotification: (id) => {
    const notifications = get().notifications;
    set({ 
      notifications: notifications.filter(n => n.id !== id) 
    });
  },
  
  clearNotifications: () => set({ notifications: [] }),
  
  // Getters
  getProfile: () => get().profile,
  getNotificationCount: () => get().notifications.length
}));
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Set user
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      // Set token
      setToken: (token) => {
        // Store token in localStorage for axios interceptor
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
        
        set({
          token,
          isAuthenticated: !!token,
        });
      },

      // Set loading state
      setLoading: (isLoading) =>
        set({ isLoading }),

      // Set error
      setError: (error) =>
        set({ 
          error,
          isLoading: false // Always stop loading when error occurs
        }),

      // Clear error
      clearError: () =>
        set({ error: null }),

      // Clear all auth data
      clearAuth: () => {
        // Clear localStorage tokens
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        
        // Reset state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Initialize auth from localStorage token
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        const storedData = localStorage.getItem('auth-storage');
        
        if (token && storedData) {
          try {
            const parsed = JSON.parse(storedData);
            set({
              token,
              user: parsed.state?.user || null,
              isAuthenticated: true,
            });
          } catch (error) {
            console.error('Failed to parse stored auth data:', error);
            get().clearAuth();
          }
        }
      },

      // Login action
      login: (user, token) => {
        localStorage.setItem('token', token);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false, // Stop loading on successful login
          error: null,
        });
      },

      // Logout action
      logout: () => {
        get().clearAuth();
      },

      // Helper to get branch info
      getBranch: () => {
        const state = get();
        return state.user?.branch || null;
      },

      // Helper to get branch ID
      getBranchId: () => {
        const state = get();
        return state.user?.branchId || null;
      },

      // Helper to get branch name
      getBranchName: () => {
        const state = get();
        return state.user?.branch?.name || '';
      },

      // Helper to get branch code
      getBranchCode: () => {
        const state = get();
        return state.user?.branch?.code || '';
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
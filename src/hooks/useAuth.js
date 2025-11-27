import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../api/auth';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

/**
 * Login Hook
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login, setError, setLoading, clearError } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await authAPI.login(credentials);
      
      // KEY FIX: Check if the response indicates failure
      if (!response.success) {
        // Throw an error to trigger onError callback
        throw new Error(response.message || 'Invalid email or password');
      }
      
      // Validate that we have the required data
      if (!response.data?.user || !response.data?.token) {
        throw new Error('Invalid response from server');
      }
      
      return response;
    },
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      console.log('Login successful:', response);
      
      const { user, token } = response.data;
      
      // Use the login action from store
      login(user, token);
      
      // Invalidate and refetch any user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Stop loading before navigation
      setLoading(false);
      
      // Navigate to dashboard
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Login error:', error);
      setLoading(false);
      setError(error.message || 'Login failed. Please try again.');
    },
    // Remove onSettled to avoid conflicts
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      // If you have a logout API endpoint, call it here
      // await authAPI.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear auth state
      logout();
      
      // Clear all cached queries
      queryClient.clear();
      
      // Navigate to login
      navigate('/login');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state and redirect
      logout();
      navigate('/login');
    }
  });
};

/**
 * Register Hook
 */
export const useRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login, setError, setLoading, clearError } = useAuthStore();

  return useMutation({
    mutationFn: (userData) => authAPI.register(userData),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      console.log('Register response:', response);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        if (token && user) {
          login(user, token);
          queryClient.invalidateQueries({ queryKey: ['user'] });
          navigate('/dashboard');
        } else {
          setLoading(false);
          setError('Invalid response from server');
        }
      } else {
        setLoading(false);
        setError(response.message || 'Registration failed');
      }
    },
    onError: (error) => {
      console.error('Register error:', error);
      setLoading(false);
      setError(error.message || 'Registration failed. Please try again.');
    },
  });
};

/**
 * Get Current User Hook (using useQuery for automatic refetching)
 */
export const useCurrentUser = () => {
  const { setUser, setError, isAuthenticated, token, logout } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser', token],
    queryFn: async () => {
      const response = await authAPI.getCurrentUser();
      return response.data;
    },
    enabled: !!isAuthenticated && !!token, // Only run if authenticated
    onSuccess: (data) => {
      setUser(data);
    },
    onError: (error) => {
      console.error('Get current user error:', error);
      setError(error.message || 'Failed to fetch user data.');
      // If unauthorized, logout
      if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        logout();
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get Branches Hook
 */
export const useGetBranches = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const response = await authAPI.getBranches();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Change Password Hook
 */
export const useChangePassword = () => {
  const { setError, setLoading, clearError } = useAuthStore();

  return useMutation({
    mutationFn: (passwords) => authAPI.changePassword(passwords),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      setLoading(false);
      console.log('Password changed:', response.message);
    },
    onError: (error) => {
      console.error('Change password error:', error);
      setLoading(false);
      setError(error.message || 'Failed to change password.');
    },
  });
};

/**
 * Forgot Password Hook
 */
export const useForgotPassword = () => {
  const { setError, setLoading, clearError } = useAuthStore();

  return useMutation({
    mutationFn: (email) => authAPI.forgotPassword(email),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      setLoading(false);
      console.log('Password reset email sent:', response.message);
    },
    onError: (error) => {
      console.error('Forgot password error:', error);
      setLoading(false);
      setError(error.message || 'Failed to send reset email.');
    },
  });
};

/**
 * Reset Password Hook
 */
export const useResetPassword = () => {
  const navigate = useNavigate();
  const { setError, setLoading, clearError } = useAuthStore();

  return useMutation({
    mutationFn: (data) => authAPI.resetPassword(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      setLoading(false);
      console.log('Password reset successful:', response.message);
      navigate('/login');
    },
    onError: (error) => {
      console.error('Reset password error:', error);
      setLoading(false);
      setError(error.message || 'Failed to reset password.');
    },
  });
};
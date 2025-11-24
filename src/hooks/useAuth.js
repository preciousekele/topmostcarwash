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
    mutationFn: (credentials) => authAPI.login(credentials),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      console.log('Login response:', response);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        if (token && user) {
          // Use the login action from store
          login(user, token);
          
          // Invalidate and refetch any user-related queries
          queryClient.invalidateQueries({ queryKey: ['user'] });
          
          // Navigate to dashboard
          navigate('/dashboard');
        } else {
          setLoading(false);
          setError('Invalid response from server');
        }
      } else {
        setLoading(false);
        setError(response.message || 'Login failed');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      setLoading(false);
      setError(error.message || 'Login failed. Please try again.');
    },
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
 * Logout Hook
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: () => authAPI.logout(),
    onMutate: () => setLoading(true),
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate('/login');
    },
    onError: (error) => {
      console.error('Logout API error:', error);
      // Even if API fails, clear local auth
      logout();
      queryClient.clear();
      navigate('/login');
    },
    onSettled: () => setLoading(false),
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
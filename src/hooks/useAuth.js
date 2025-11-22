import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../api';
import useAuthStore from '../store/authStore';

/**
 * Login Hook
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser, setToken, setError, setLoading, login } = useAuthStore();

  return useMutation({
    mutationFn: (credentials) => authAPI.login(credentials),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      console.log('Login response:', response);
      
      // Extract token and user from response
      const token = response.data?.token;
      const user = response.data?.user;
      
      if (token && user) {
        // Use the login action from store
        login(user, token);
        
        // Invalidate and refetch any user-related queries
        queryClient.invalidateQueries({ queryKey: ['user'] });
      } else {
        setLoading(false);
        setError('Invalid response from server');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      setLoading(false);
      setError(error.message || 'Login failed. Please try again.');
      setUser(null);
      setToken(null);
    },
  });
};

/**
 * Register Hook
 */
export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setUser, setToken, setError, setLoading, login } = useAuthStore();

  return useMutation({
    mutationFn: (userData) => authAPI.register(userData),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      console.log('Register response:', response);
      
      const token = response.data?.token;
      const user = response.data?.user;
      
      if (token && user) {
        login(user, token);
        queryClient.invalidateQueries({ queryKey: ['user'] });
      } else {
        setLoading(false);
        setError('Invalid response from server');
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
  const queryClient = useQueryClient();
  const { clearAuth, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: () => authAPI.logout(),
    onMutate: () => setLoading(true),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout API error:', error);
      // Even if API fails, clear local auth
      clearAuth();
      queryClient.clear();
    },
    onSettled: () => setLoading(false),
  });
};

/**
 * Get Current User Hook (using useQuery for automatic refetching)
 */
export const useCurrentUser = () => {
  const { setUser, setError, isAuthenticated, token } = useAuthStore();

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
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Change Password Hook
 */
export const useChangePassword = () => {
  const { setError, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: (passwords) => authAPI.changePassword(passwords),
    onMutate: () => {
      setLoading(true);
      setError(null);
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
import { useMutation, useQuery } from '@tanstack/react-query';
import { authAPI } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
  const { login, setLoading, setError } = useAuthStore();
  
  return useMutation({
    mutationFn: authAPI.login,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      // Handle the mock response structure
      const { data } = response;
      login(data.user, data.token);
      setLoading(false);
    },
    onError: (error) => {
      // Handle mock error
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      setLoading(false);
    }
  });
};

export const useRegister = () => {
  const { setLoading, setError } = useAuthStore();
  
  return useMutation({
    mutationFn: authAPI.register,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      setLoading(false);
      // Optionally auto-login after registration
      // const { data } = response;
      // login(data.user, data.token);
    },
    onError: (error) => {
      const message = error.message || 'Registration failed';
      setError(message);
      setLoading(false);
    }
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  
  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      logout();
    },
    onError: () => {
      // Even if API call fails, clear local state
      logout();
    }
  });
};
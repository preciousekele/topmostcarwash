import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../api/user';
import { useUserStore } from '../store/userStore';

export const useUserProfile = () => {
  const { setProfile } = useUserStore();
  
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: userAPI.getProfile,
    onSuccess: (data) => {
      setProfile(data);
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateProfile, setUpdating } = useUserStore();
  
  return useMutation({
    mutationFn: userAPI.updateProfile,
    onMutate: () => {
      setUpdating(true);
    },
    onSuccess: (data) => {
      updateProfile(data);
      queryClient.invalidateQueries(['userProfile']);
    },
    onError: () => {
      setUpdating(false);
    }
  });
};
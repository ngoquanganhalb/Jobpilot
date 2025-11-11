import { ProfileUser } from "@/dtos/auth/profile-user.dto";
import { authService } from "@services/auth/authService";
import { useQuery } from "@tanstack/react-query";

type UseGetUserProfileReturn = {
  data: ProfileUser | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

export const useGetUserProfile = (): UseGetUserProfileReturn => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["TANSTACK_QUERY_KEY.GET_USER_PROFILE"],
    queryFn: async () => {
      const response = await authService.apiGetProfile();
      return response;
    },
    enabled: true,
  });
  return { data, isLoading, isError, refetch };
};

import { AuthService } from "@services/auth/authService";
import { useQuery } from "@tanstack/react-query";

type UseGetUserProfileReturn = {
  data: any;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};
export const useGetUserProfile = (
  onSuccess?: (response: any) => void
): UseGetUserProfileReturn => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["TANSTACK_QUERY_KEY.GET_USER_PROFILE"],
    queryFn: async () => {
      const response = await AuthService.apiGetProfile();
      onSuccess?.(response);
      return response;
    },
    enabled: true,
  });
  return { data, isLoading, isError, refetch };
};

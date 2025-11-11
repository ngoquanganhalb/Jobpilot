import { clearAuth } from "@redux/slices/authSlice";
import { authService } from "@services/auth/authService";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useLogout = () => {
  const dispatch = useDispatch();
  const {
    mutateAsync: mutateAsyncLogout,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: () => {
      return authService.apiLogout();
    },
  });
  const logoutMutation = async (): Promise<void> => {
    await dispatch(clearAuth());

    return mutateAsyncLogout();
  };
  return { logoutMutation, isSuccess, isError };
};

import { LoginDto } from "@/dtos/auth/login.dto";
import { setUser } from "@redux/slices/authSlice";
import { authService } from "@services/auth/authService";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export const useLogin = () => {
  const dispatch = useDispatch();
  const {
    mutateAsync: mutateAsyncLogin,
    isSuccess: isSuccessLogin,
    isError: isErrorLogin,
  } = useMutation({
    mutationFn: async (body: LoginDto) => {
      await authService.login(body);
      const profile = await authService.apiGetProfile();
      // console.log("profile", profile);
      return profile;
    },
    onError: (e) => {
      toast.error(e.message);
    },
    onSuccess: (profile) => {
      dispatch(
        setUser({ permissions: profile.permissions, user: profile.user })
      ); // authslice
      toast.success("Welcome 👋");
    },
  });
  const loginMutation = async (body: LoginDto): Promise<any> => {
    return mutateAsyncLogin(body);
  };
  return {
    loginMutation,
    isSuccessLogin,
    isErrorLogin,
  };
};

import { SignUpDto } from "@/dtos/auth/sign-up.dto";
import { authService } from "@services/auth/authService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useSignUp = () => {
  const {
    mutateAsync: mutateAsyncSignUp,
    isError: isErrorSignUp,
    isSuccess: isSuccessSignUp,
  } = useMutation({
    mutationFn: (body: SignUpDto) => {
      return authService.signUp(body);
    },
    onSuccess: () => {
      toast.success("Create account success");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const signUpMutation = async (body: SignUpDto): Promise<any> => {
    return mutateAsyncSignUp(body);
  };
  return {
    signUpMutation,
    isErrorSignUp,
    isSuccessSignUp,
  };
};

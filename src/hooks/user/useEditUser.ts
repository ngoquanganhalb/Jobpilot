import { UpdateUserDto } from "@/dtos/user/update-user.dto";
import { userService } from "@services/user/user.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useEditUser = () => {
  const {
    mutateAsync: mutateAsyncEditUser,
    isError: isErrorEditUser,
    isSuccess: isSuccessEditUser,
  } = useMutation({
    mutationFn: (data: Partial<UpdateUserDto>) => {
      return userService.editUser(data);
    },
    onSuccess: () => toast.success("Saved!"),
    onError: (e: any) => toast.error(e?.message || "Update failed"),
  });
  const editMutation = async (body: Partial<UpdateUserDto>) => {
    return mutateAsyncEditUser(body);
  };
  return {
    editMutation,
    isErrorEditUser,
    isSuccessEditUser,
  };
};

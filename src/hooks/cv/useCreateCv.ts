import { cvService } from "@services/cv/cv.service";
import { useMutation } from "@tanstack/react-query";
import { Cv } from "../../types/db";
import { toast } from "react-toastify";

export const useCreateCv = () => {
  const { mutateAsync, isError, isSuccess } = useMutation({
    mutationFn: (cv: Cv) => cvService.createCv(cv),
    onSuccess: () => toast.success("Create success!"),
    onError: (e: any) => toast.error(e?.message || "create failed"),
  });
  const createCvMutation = async (cv: Cv): Promise<any> => {
    return await mutateAsync(cv);
  };
  return {
    createCvMutation,
    isError,
    isSuccess,
  };
};

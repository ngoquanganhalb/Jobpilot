import { cvService } from "@services/cv/cv.service";
import { useMutation } from "@tanstack/react-query";

export const useDeleteCv = () => {
  const mutation = useMutation({
    mutationFn: (id: number) => cvService.deleteCv(id),
  });

  const deleteCvMutation = async (id: number) => {
    return await mutation.mutateAsync(id);
  };

  return {
    deleteCvMutation,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
};

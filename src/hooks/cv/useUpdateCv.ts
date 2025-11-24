import { cvService } from "@services/cv/cv.service";
import { useMutation } from "@tanstack/react-query";
import { Cv } from "../../types/db";

type UpdateCvParams = { id: number; cv: Partial<Cv> };

export const useUpdateCv = () => {
  const { mutateAsync, isError, isSuccess } = useMutation({
    mutationFn: ({ id, cv }: UpdateCvParams) => cvService.updateCv(id, cv),
  });

  const updateCvMutation = async (id: number, cv: Partial<Cv>) => {
    return await mutateAsync({ id, cv });
  };

  return {
    updateCvMutation,
    isError,
    isSuccess,
  };
};

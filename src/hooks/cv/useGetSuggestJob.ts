import { SuggestJobInputDto } from "@/dtos/cv/suggest-job-input.dto";
import { cvService } from "@services/cv/cv.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
type useGetSuggestJobReturn = {
  getSuggestJobMutation: any;
  isError: boolean;
  isSuccess: boolean;
};
export const useGetSuggestJob = (): useGetSuggestJobReturn => {
  const {
    mutateAsync: mutateAsyncGetSuggestJob,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: async (payload: SuggestJobInputDto) => {
      return cvService.getSuggestJob(payload);
    },
    onError: (e: any) => toast.error(e?.message || "Fail to get API"),
  });
  const getSuggestJobMutation = (payload: SuggestJobInputDto) => {
    return mutateAsyncGetSuggestJob(payload);
  };

  return {
    getSuggestJobMutation,
    isError,
    isSuccess,
  };
};

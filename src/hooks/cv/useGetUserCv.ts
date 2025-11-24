import { cvService } from "@services/cv/cv.service";
import { useQuery } from "@tanstack/react-query";
import { Cv } from "../../types/db";
type UseGetUserCvReturn = {
  data: Cv[];
  isError: boolean;
  isLoading: boolean;
  refetch: () => void;
};
export const useGetUserCv = (): UseGetUserCvReturn => {
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["GET_USER_CV"],
    queryFn: () => cvService.getUserCv(),
  });
  return {
    data,
    isError,
    isLoading,
    refetch,
  };
};

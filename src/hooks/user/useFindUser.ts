import { User } from "@/dtos/user/user.dto";
import { userService } from "@services/user/user.service";
import { useQuery } from "@tanstack/react-query";
type UseFindUserReturnType = {
  data: User[];
  isLoading: boolean;
  isError: boolean;
};
export const useFindUser = (id: number[]): UseFindUserReturnType => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["GET_USER", id],
    queryFn: () => {
      return userService.findUser(id);
    },
    enabled: Boolean(id.length > 0),
  });
  return { data, isLoading, isError };
};

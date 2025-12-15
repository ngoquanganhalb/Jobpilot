import { videoCallService } from "@services/videocall/videocall.service";
import { useQuery } from "@tanstack/react-query";

export const useGetHistoryChat = (roomId: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["history-chat", roomId],
    queryFn: () => videoCallService.getChatHistory(roomId),
    enabled: !!roomId
  });
  return { data, isLoading, isError };
};

import { WsNotificationRequest } from "@/dtos/notification/WsNotificationRequest";
import {
  notificationService,
} from "@services/notification.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useNotification = (userId?: number) => {
  const queryClient = useQueryClient();

  /* ---------------- GET NOTIFICATIONS ---------------- */
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => notificationService.getByUser(userId!),
    enabled: !!userId,
  });

  /* ---------------- SEND NOTIFICATION ---------------- */
  const sendMutation = useMutation({
    mutationFn: (req: WsNotificationRequest) =>
      notificationService.sendNotification(req),
    onSuccess: () => toast.success("Send notification success!"),
    onError: () => toast.error("Send notification failed!"),
  });

  /* ---------------- MARK AS READ ---------------- */
  const readMutation = useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      // auto refetch list
      queryClient.invalidateQueries({
        queryKey: ["notifications", userId],
      });
    },
  });

  return {
    /* data */
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,

    /* states */
    isLoading,
    isError,
    refetch,

    /* actions */
    sendNotification: sendMutation.mutateAsync,
    markAsRead: readMutation.mutateAsync,
  };
};

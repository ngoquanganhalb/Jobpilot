import { WsNotificationRequest } from "@/dtos/notification/WsNotificationRequest";
import { notificationService } from "@services/notification.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useSendNotification = () => {
  const { mutateAsync, isError, isSuccess } = useMutation({
    // mutationKey: ["send-notification"],
    mutationFn: async (req: WsNotificationRequest) => {
      return notificationService.sendNotification(req);
    },
    onSuccess: () => toast.success("Send notification success!"),
    onError: () => toast.error("Send notification failed!"),
  });
  return { mutateAsync, isError, isSuccess };
};

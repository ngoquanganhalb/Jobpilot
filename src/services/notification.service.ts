import { WsNotificationRequest } from "@/dtos/notification/WsNotificationRequest";
import { BaseService } from "./base.service";
import { NotificationResponse } from "@/dtos/notification/NotificationResponse";

class NotificationService extends BaseService {
  constructor() {
    super(
      `${process.env.NEXT_PUBLIC_API_JAVA_BASE_URL}/api/v1/ws-notification`
    );
  }
  public async sendNotification(req: WsNotificationRequest) {
    return this.postResponse(`/send`, {
      receiverId: req.receiverId,
      type: req.type,
      message: req.message,
      url: req.url,
    });
  }

  public async getByUser(userId: number): Promise<NotificationResponse[]> {
    return this.getResponse(`?userId=${userId}`);
  }

  public async markAsRead(id: number) {
    return this.postResponse(`/${id}/read`, {});
  }
}
export const notificationService = new NotificationService();

export interface NotificationResponse {
  id: number;
  type: string;
  message: string;
  url: string;
  read: boolean;
  createdAt: string;
}
import { ChatHistoryResponse } from "@/dtos/videocall/ChatHistoryResponse";
import { BaseService } from "@services/base.service";

class VideoCallService extends BaseService {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_API_JAVA_BASE_URL}/api/v1/videocall`);
  }
  public async getChatHistory(roomId: string) {
    return this.getResponse<ChatHistoryResponse[]>(`/${roomId}/get-history`);
  }

}
export const videoCallService = new VideoCallService();

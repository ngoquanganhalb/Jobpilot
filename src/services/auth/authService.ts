import { tokenManager } from "@/core/tokenManager";
import { LoginDto } from "@/dtos/auth/login.dto";
import { SignUpDto } from "@/dtos/auth/sign-up.dto";
import { BaseService } from "@services/base.service";
class AuthService extends BaseService {
  constructor() {
    super("auth");
  }

  public async refreshSession(): Promise<string | null> {
    const res = await this.post(`/refresh-session`);
    tokenManager.setAccessToken(res.data.accessToken);
    return res.data.accessToken;
  }

  public async apiLogout(): Promise<void> {
    await this.post(`/logout`);
    tokenManager.clear();
  }

  public async apiGetProfile() {
    const response = await this.get(`/users/profile`, { ignoreBaseURL: true });
    return response.data;
  }

  public async login(body: LoginDto) {
    const response = await this.post(`/login`, body);
    return response.data;
  }

  public async signUp(body: SignUpDto) {
    const response = await this.post(`/sign-up`, body);
    return response.data;
  }
}
export const authService = new AuthService();

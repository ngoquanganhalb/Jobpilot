//authService.ts
import { tokenManager } from "@/core/tokenManager";
import { LoginDto } from "@/dtos/auth/login.dto";
import { ProfileUser } from "@/dtos/auth/profile-user.dto";
import { SignUpDto } from "@/dtos/auth/sign-up.dto";
import { BaseService } from "@services/base.service";
type SocialLoginDto = {
  provider: string;
  providerAccountId: string;
  email: string;
  name: string;
  providerAccessToken: string;
  picture: string;
  client: string;
};
class AuthService extends BaseService {
  constructor() {
    super("auth");
  }

  public async refreshSession(): Promise<string | undefined> {
    const res = await this.post(`/refresh-session`);
    // tokenManager.setAccessToken(res.data.accessToken);
    return res.data.accessToken;
  }

  public async apiLogout(): Promise<void> {
    await this.post(`/logout`);
    // tokenManager.clear();
  }

  public async apiGetProfile() {
    return await this.get<ProfileUser>(`/users/profile`, {
      ignoreBaseURL: true,
      withCredentials: true,
    });
  }

  public async login(body: LoginDto) {
    const response = await this.post(`/login`, body);
    tokenManager.setAccessToken(response.accessToken);
    return response;
  }

  public async signUp(body: SignUpDto) {
    const response = await this.post(`/sign-up`, body);
    return response;
  }

  // public async loginSocial(body: SocialLoginDto): Promise<{
  //   accessToken: string;
  //   refreshToken: string;
  //   expiredAt: Date;
  //   refreshTokenExpiredAt: Date;
  //   isNewUser: boolean;
  // }> {
  //   const response = await this.post(`/social-login`, body, {
  //     headers: { "x-internal-key": process.env.AUTH_GOOGLE_SECRET ?? "" },
  //   });
  //   return response.data;
  // }
  public async loginSocial(payload: SocialLoginDto): Promise<{
    data: any;
    accessToken: string;
    refreshToken: string;
    expiredAt: Date;
    refreshTokenExpiredAt: Date;
    isNewUser: boolean;
  }> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/social-login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "x-internal-key": process.env.INTERNAL_API_KEY ?? "",
        },
        body: JSON.stringify(payload),
      }
    );
    return res.json();
  }
}
export const authService = new AuthService();

import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { authService } from "@services/auth/authService";
import { USER_ROLE } from "@/common/enum";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account?.provider || !account?.providerAccountId) return false;

      try {
        const payload = {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          email: user?.email ?? (profile as any)?.email ?? null,
          name: user?.name ?? (profile as any)?.name ?? null,
          picture:
            account.provider === "google"
              ? (profile as any)?.picture
              : (profile as any)?.picture?.data?.url,
          providerAccessToken: (account as any)?.access_token,
          client: USER_ROLE.USER,
        };

        const res = await authService.loginSocial(payload);
        console.log("⬅️ social-login response:", res);

        if (!res) {
          console.error("social-login failed: response is null");
          return false;
        }
        console.log("console", res);

        // ✅ redirect hợp lệ cho NextAuth App Router
        return `/api/auth/set-cookies?access_token=${encodeURIComponent(
          res.data.accessToken
        )}&refresh_token=${encodeURIComponent(res.data.refreshToken)}`;
      } catch (e) {
        console.error("social-login error:", e);
        return false;
      }
    },
  },
};

import NextAuth, { NextAuthOptions } from "next-auth";
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
  // session: { strategy: "jwt" },
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
            account?.provider === "google"
              ? (profile as any)?.picture
              : (profile as any)?.picture?.data?.url,
          providerAccessToken: (account as any)?.access_token,
          client: USER_ROLE.ADMIN,
        };

        // const res = await fetch(
        //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/social-login`,
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //       // "x-internal-key": process.env.INTERNAL_API_KEY ?? "",
        //     },
        //     body: JSON.stringify(payload),
        //   }
        // );
        const res = await authService.loginSocial(payload);

        // if (!res.ok) {
        //   console.error("social-login failed:", res.status, await res.text());
        //   return false; // → Access Denied nếu fail
        // }
        if (!res) {
          console.error("social-login failed: response is null");
        }

        // ⬇️⬇️ CHỈ THÊM 1 DÒNG NÀY: trả URL để NextAuth redirect trình duyệt
        return `/api/auth/set-cookies?access_token=${encodeURIComponent(
          res?.data.accessToken
        )}&refresh_token=${encodeURIComponent(res?.data.refreshToken)}`;
      } catch (e) {
        console.error("social-login error:", e);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

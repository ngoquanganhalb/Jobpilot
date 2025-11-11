//middleware.ts
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { USER_ROLE } from "./common/enum"; // đảm bảo enum này là chuỗi trùng với payload JWT

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

// Những path KHÔNG nên chặn (assets, api refresh, sign-in…) để tránh vòng lặp
const PUBLIC_PATHS = [
  "/sign-in",
  "/api/auth/refresh",
  "/_next", // assets Next.js
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname, search } = url;

  // Bỏ qua public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Chỉ áp dụng cho các matcher đã cấu hình (dashboard, employer, candidate, homepage)
  // Nếu bạn dùng config.matcher phía dưới thì không cần check lại ở đây.

  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value || "";
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value || "";

  // Nếu thiếu cả 2 → bắt đăng nhập
  if (!accessToken && !refreshToken) {
    const signInUrl = url.clone();
    signInUrl.pathname = "/sign-in";
    signInUrl.searchParams.set("returnTo", pathname + search);
    return NextResponse.redirect(signInUrl);
  }

  // Nếu thiếu access nhưng có refresh → dẫn sang API refresh (route này sẽ set cookie và redirect ngược lại)
  if (!accessToken && refreshToken) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-session`,
      {
        method: "POST",
        headers: {
          cookie: `${REFRESH_TOKEN_COOKIE}=${refreshToken}`,
        },
        credentials: "include",
      }
    );
    return res;
  }

  // Có access token → verify
  let payload: any;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload: verified } = await jose.jwtVerify(accessToken, secret, {
      algorithms: ["HS256"],
    });
    payload = verified;
  } catch {
    // Verify fail → đăng nhập lại (không để NextResponse.next() lọt qua)
    const signInUrl = url.clone();
    signInUrl.pathname = "/sign-in";
    signInUrl.searchParams.set("returnTo", pathname + search);
    return NextResponse.redirect(signInUrl);
  }

  // Lấy role từ payload (tuỳ backend, ưu tiên field "role", fallback "client")
  const role: string | undefined = payload?.role ?? payload?.client;

  // Phân quyền theo prefix
  if (pathname.startsWith("/employer") && role !== USER_ROLE.EMPLOYER) {
    const unAuth = url.clone();
    unAuth.pathname = "/unauthorized";
    return NextResponse.redirect(unAuth);
  }
  if (pathname.startsWith("/candidate") && role !== USER_ROLE.USER) {
    const unAuth = url.clone();
    unAuth.pathname = "/unauthorized";
    return NextResponse.redirect(unAuth);
  }

  return NextResponse.next();
}

// Áp dụng cho các route cần bảo vệ
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/homepage",
    "/employer/:path*",
    "/candidate/:path*",
  ],
};

// /middleware.ts
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { USER_ROLE } from "./common/enum";

const ACCESS_TOKEN_COOKIE = "access_token";
// const ACCESS_TOKEN_COOKIE = "access_token";

const PUBLIC_PATHS = [
  "/sign-in",
  "/_next",
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

  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value || "";

  // THAY ĐỔI 1: Không redirect ngay, để client tự refresh
  if (!accessToken) {
    // Thêm header để client biết cần refresh
    const response = NextResponse.next();
    response.headers.set("X-Auth-Required", "true");
    return response;
  }

  // Verify JWT & phân quyền
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(accessToken, secret, {
      algorithms: ["HS256"],
    });
    const role: string | undefined =
      (payload as any)?.role ?? (payload as any)?.client;
    if (pathname.startsWith("/employer") && role !== USER_ROLE.EMPLOYER) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith("/candidate") && role !== USER_ROLE.USER) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    // THAY ĐỔI 2: Token expired/invalid -> để client tự refresh
    if (error instanceof jose.errors.JWTExpired) {
      const response = NextResponse.next();
      response.headers.set("X-Token-Expired", "true");
      return response;
    }

    // Token invalid hoàn toàn -> redirect
    const signInUrl = url.clone();
    signInUrl.pathname = "/sign-in";
    signInUrl.searchParams.set("returnTo", pathname + search);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/homepage",
    "/employer/:path*",
    "/candidate/:path*",
  ],
};

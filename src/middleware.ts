import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { USER_ROLE } from "./common/enum";

const ACCESS_TOKEN_COOKIE = "access_token";

const PUBLIC_PATHS = [
  "/sign-in",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/unauthorized"
];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname, search } = url;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value || "";
  // console.log("PATH:", pathname);
  // console.log("COOKIES:", req.cookies.get(ACCESS_TOKEN_COOKIE)?.value);
  // console.log("JWT_SECRET:", process.env.JWT_SECRET);
  // console.log("cookies:", req.cookies.getAll());
  // console.log(" Middleware path:", pathname);


  if (!accessToken) {
    const signInUrl = url.clone();
    signInUrl.pathname = "/sign-in";
    signInUrl.searchParams.set("returnTo", pathname + search);
    return NextResponse.redirect(signInUrl);
  }

  // Verify JWT & phân quyền
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(accessToken, secret, {
      algorithms: ["HS256"],
    });
    console.log("Token verified, payload:", payload);

    const role: string | undefined =
      (payload as any)?.role ?? (payload as any)?.client;
    console.log("User role from token:", role);
    // Check role-based access
    if (pathname.startsWith("/employer") && role !== USER_ROLE.EMPLOYER) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/candidate") && role !== USER_ROLE.USER) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.log(" Token verification failed:", error);


    const signInUrl = url.clone();
    signInUrl.pathname = "/sign-in";
    signInUrl.searchParams.set("returnTo", pathname + search);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/homepage",
    "/employer/:path*",
    "/candidate/:path*",
  ],
};

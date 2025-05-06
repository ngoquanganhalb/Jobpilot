import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";

export function middleware(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies.token;
  const accountType = cookies.accountType;
  const url = req.nextUrl.clone();

  if (!token) {
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/employer") && accountType !== "employer") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/candidate") && accountType !== "candidate") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
//path to signin first
export const config = {
  matcher: [
    "/dashboard/:path",
    "/homepage",
    "/employer/:path*",
    "/candidate/:path*",
  ],
};

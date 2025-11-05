// app/api/auth/set-cookies/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const accessToken = url.searchParams.get("access_token");
  const refreshToken = url.searchParams.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect("/");
  }

  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = NextResponse.redirect(new URL("/", base)); // ✅ dùng URL tuyệt đối
  // Set cookie giống BE mong muốn
  res.headers.append(
    "Set-Cookie",
    `access_token=${accessToken}; Path=/; HttpOnly`
  );
  res.headers.append(
    "Set-Cookie",
    `refresh_token=${refreshToken}; Path=/; HttpOnly`
  );

  return res;
}

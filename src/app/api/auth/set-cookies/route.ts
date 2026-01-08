// // app/api/auth/set-cookies/route.ts
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const url = new URL(req.url);
//   const accessToken = url.searchParams.get("access_token");
//   const refreshToken = url.searchParams.get("refresh_token");

//   if (!accessToken || !refreshToken) {
//     return NextResponse.redirect("/");
//   }

//   const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
//   const res = NextResponse.redirect(new URL("/", base)); // ✅ dùng URL tuyệt đối
//   // Set cookie giống BE mong muốn
//   res.headers.append(
//     "Set-Cookie",
//     `access_token=${accessToken}; Path=/; HttpOnly`
//   );
//   res.headers.append(
//     "Set-Cookie",
//     `refresh_token=${refreshToken}; Path=/; HttpOnly`
//   );

//   return res;
// }

// app/api/auth/set-cookies/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  if (!accessToken || !refreshToken) {
    console.error(" Missing tokens in set-cookies");
    return NextResponse.redirect(
      new URL("/sign-in?error=missing_tokens", req.url)
    );
  }

  try {
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === "production";

    console.log(
      " Setting cookies - Environment:",
      isProd ? "Production" : "Development"
    );

    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: isProd, // true trên production
      sameSite: isProd ? "none" : "lax", // none cho cross-subdomain trên production
      maxAge: 60 * 10, // 10 phút
      path: "/",
      ...(isProd && { domain: ".jobpilot.id.vn" }), // ✅ Có dấu chấm đầu tiên
    });

    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 60 * 60 * 10, // 10 giờ
      path: "/",
      ...(isProd && { domain: ".jobpilot.id.vn" }),
    });

    console.log("✅ Cookies set successfully");
    console.log("   - Domain:", isProd ? ".jobpilot.id.vn" : "localhost");
    console.log("   - SameSite:", isProd ? "none" : "lax");
    console.log("   - Secure:", isProd);

    // Redirect về homepage hoặc returnTo
    const returnTo = searchParams.get("returnTo") || "/";
    return NextResponse.redirect(new URL(returnTo, req.url));
  } catch (error) {
    console.error("❌ Error setting cookies:", error);
    return NextResponse.redirect(
      new URL("/sign-in?error=cookie_failed", req.url)
    );
  }
}

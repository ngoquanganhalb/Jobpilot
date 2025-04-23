//middleware.ts
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

  // Auto redirect conditional route @emp @can
  // if (["/dashboard", "/homepage", "/settings"].includes(url.pathname)) {
  //   url.pathname = `${url.pathname}/${accountType}`;
  //   return NextResponse.redirect(url);
  // }
  // if (url.pathname === "/dashboard") {
  //   url.pathname = accountType === "employer"
  //     ? "/dashboard/@employer"
  //     : "/dashboard/@candidate";
  //   return NextResponse.redirect(url);
  // }
  // Restrict: route start with /emloyer /candidatecandidate
  if (url.pathname.startsWith("/employer") && accountType !== "employer") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/candidate") && accountType !== "candidate") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  // if (req.nextUrl.pathname === "/dashboard") {
  //   if (accountType === "candidate") {
  //     return NextResponse.rewrite(new URL("/dashboard/@candidate", req.url));
  //   } else if (accountType === "employer") {
  //     return NextResponse.rewrite(new URL("/dashboard/@employer", req.url));
  //   }
  // }

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



// // middleware.ts cái này chỉ check cho route /employer/page? /candidate/page
// import { NextRequest, NextResponse } from "next/server";
// import { parse } from "cookie";

// export function middleware(req: NextRequest) {
//   const cookieHeader = req.headers.get("cookie") || "";
//   const cookies = parse(cookieHeader);
//   const token = cookies.token;
//   const accountType = cookies.accountType;
//   const url = req.nextUrl.clone();

//   if (!token) {
//     url.pathname = "/sign-in";
//     return NextResponse.redirect(url);
//   }

//   // Dùng cookie để phân quyền nhẹ
//   if (url.pathname.startsWith("/employer") && accountType !== "employer") {
//     url.pathname = "/unauthorized";
//     return NextResponse.redirect(url);
//   }

//   if (url.pathname.startsWith("/candidate") && accountType !== "candidate") {
//     url.pathname = "/unauthorized";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }
// //middleware check these route
// export const config = {
//   matcher: ["/employer/:path*", "/candidate/:path*"],
// };

//backend

// // middleware.ts
// import { NextRequest, NextResponse } from "next/server";
// import { parse } from "cookie";

// export function middleware(req: NextRequest) {
//   const cookieHeader = req.headers.get("cookie") || "";
//   const cookies = parse(cookieHeader);
//   const token = cookies.token;
//   const accountType = cookies.accountType;
//   const url = req.nextUrl.clone();

//   if (!token) {
//     url.pathname = "/sign-in";
//     return NextResponse.redirect(url);
//   }

//   if (url.pathname.startsWith("/employer") && accountType !== "employer") {
//     url.pathname = "/unauthorized";
//     return NextResponse.redirect(url);
//   }

//   if (url.pathname.startsWith("/candidate") && accountType !== "candidate") {
//     url.pathname = "/unauthorized";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/employer/:path*", "/candidate/:path*"],
// };

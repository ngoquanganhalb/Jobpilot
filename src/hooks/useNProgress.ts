// "use client";

// import { useEffect } from "react";
// import { usePathname } from "next/navigation";
// import NProgress from "nprogress";

// export function useNProgress() {
//   const pathname = usePathname();

//   useEffect(() => {
//     NProgress.start();

//     const timer = setTimeout(() => {
//       NProgress.done();
//     }, 300);

//     return () => {
//       clearTimeout(timer);
//       NProgress.done();
//     };
//   }, [pathname]);
// }
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export function useNProgress() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    NProgress.start();

    // Tạo timer để dừng sau 300ms
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);
}

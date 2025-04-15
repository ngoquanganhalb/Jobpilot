"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter((seg) => seg !== "");

  const getPath = (index: number) =>
    "/" + segments.slice(0, index + 1).join("/");

  return (
    <div className="bg-gray-200 flex flex-col md:flex-row md:justify-between items-center md:px-[150px] py-7 gap-4 md:gap-0 2xl:max-h-12">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <h1 className="text-xl font-medium text-gray-800 capitalize">
          {segments[segments.length - 1] || "Home"}
        </h1>
        <div className="flex items-center text-sm space-x-2">
          <Link href="/" className="text-gray-500 hover:text-blue-600">
            Home
          </Link>
          {segments.map((segment, index) => (
            <div className="flex items-center space-x-2" key={index}>
              <span className="text-gray-400">/</span>
              {index === segments.length - 1 ? (
                <span className="text-gray-700 capitalize">{segment}</span>
              ) : (
                <Link
                  href={getPath(index)}
                  className="text-gray-500 hover:text-blue-600 capitalize"
                >
                  {segment}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

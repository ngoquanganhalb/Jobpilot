"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((seg) => seg !== "");

  const getPath = (index: number) =>
    "/" + segments.slice(0, index + 1).join("/");

  const formatSegment = (segment: string, index: number) => {
    if (segments[0] === "find-job" && index === segments.length - 1) {
      return "Job Details";
    }

    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="bg-gray-200 flex flex-col md:flex-row md:justify-between items-center md:px-[100px] py-7 gap-4 md:gap-0 2xl:max-h-12">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Title trái */}
        <h1 className="text-xl font-semibold text-gray-800 capitalize">
          {segments.length === 0
            ? "Home"
            : formatSegment(segments[segments.length - 1], segments.length - 1)}
        </h1>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm space-x-2">
          <Link href="/" className="text-gray-500 hover:text-blue-600">
            Home
          </Link>
          {segments.map((segment, index) => (
            <div className="flex items-center space-x-2" key={index}>
              <span className="text-gray-400">/</span>
              {index === segments.length - 1 ? (
                <span className="text-gray-700 capitalize">
                  {formatSegment(segment, index)}
                </span>
              ) : (
                <Link
                  href={getPath(index)}
                  className="text-gray-500 hover:text-blue-600 capitalize"
                >
                  {formatSegment(segment, index)}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

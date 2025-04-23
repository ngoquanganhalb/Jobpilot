"use client";

import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ButtonSlideBarProps } from "@types";
import { Paths } from "@/constants/paths";

export default function ButtonSlideBar({
  label,
  icon,
  onClick,
  className = "",
  href = "", // thêm prop href vào để so sánh
  ...props
}: ButtonSlideBarProps & { href: string }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href); //tự động active


  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full flex items-center px-4 py-3 rounded-md mb-1 transition-all duration-100 ease-in-out cursor-pointer",
        isActive
          ? "bg-blue-100 text-blue-600 scale-[1.02] shadow-md border-l-4 border-blue-600"
          : "text-gray-700 hover:bg-gray-200 hover:scale-[1.01]",
        className
      )}
      {...props}
    >
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

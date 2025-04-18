import { ButtonSlideBarProps } from "@types";
import clsx from "clsx";

export default function ButtonSlideBar({
  label,
  icon,
  isActive = false,
  onClick,
  className = "",
  ...props
}: ButtonSlideBarProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full flex items-center px-4 py-3 rounded-md mb-1 transition-all duration-100 ease-in-out cursor-pointer",
        isActive
          ? "bg-blue-100 text-blue-600 scale-[1.02] shadow-md border-l-4 border-blue-600"
          : "text-gray-700 hover:bg-gray-200 hover:scale-[1.01] ",
        className
      )}
      {...props}
    >
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

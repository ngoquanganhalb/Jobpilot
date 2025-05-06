import { ButtonProps } from "@types";

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  let variantStyles = "";

  if (variant === "primary") {
    variantStyles = "bg-[#0A65CC] text-white  hover:bg-blue-500 ";
  } else {
    variantStyles = "bg-white text-[#0A65CC] ";
  }
  return (
    <button
      className={`
        rounded-[3px]
        flex items-center
        text-[16px]
        font-semibold
        leading-[24px]
        px-[24px]
        py-[12px]
        border
        border-blue-100
        cursor-pointer
       hover:bg-blue-300
       whitespace-nowrap
        ${variantStyles}
        ${className}
        `}
      {...props}
    >
      {children}
    </button>
  );
}

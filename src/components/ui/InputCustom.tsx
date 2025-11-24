import React, { forwardRef } from "react";
import { InputProps } from "@types";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          className={`
            w-full p-3 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${icon ? "pl-10" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

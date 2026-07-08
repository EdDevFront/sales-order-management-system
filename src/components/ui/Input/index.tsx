import React from "react";
import { tv } from "tailwind-variants";

const input = tv({
  base: "flex h-11 sm:h-10 w-full rounded-lg border bg-white px-4 sm:px-3 py-3 sm:py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400",
  variants: {
    error: {
      true: "border-red-400 focus-visible:ring-red-500 dark:border-red-600",
      false: "border-zinc-200 dark:border-zinc-800",
    },
  },
  defaultVariants: {
    error: false,
  },
});

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={input({ className })}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

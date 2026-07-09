import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 h-10 px-5 py-2",
  variants: {
    variant: {
      primary:
        "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-sm hover:shadow-md transition-all",
      secondary:
        "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
      outline:
        "border-2 border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 active:bg-indigo-100 dark:border-indigo-800 dark:bg-transparent dark:text-indigo-400 dark:hover:bg-indigo-950/30 dark:hover:border-indigo-700",
      ghost:
        "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
      danger:
        "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 shadow-sm hover:shadow-md",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export type ButtonVariants = VariantProps<typeof button>;
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {}

export function Button({
  className = "",
  variant,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={button({ variant, className })} {...props}>
      {children}
    </button>
  );
}

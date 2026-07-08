import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2",
  variants: {
    variant: {
      primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/10 active:scale-98",
      secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 active:scale-98",
      outline: "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 active:scale-98",
      ghost: "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
      danger: "bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-500/10 active:scale-98",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export type ButtonVariants = VariantProps<typeof button>;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {}

export function Button({ className = "", variant, children, ...props }: ButtonProps) {
  return (
    <button className={button({ variant, className })} {...props}>
      {children}
    </button>
  );
}

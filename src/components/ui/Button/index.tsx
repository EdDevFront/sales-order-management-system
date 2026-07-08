import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
}

export function Button({
  className = "",
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "h-10 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/10 active:scale-98",
    secondary:
      "h-10 px-4 py-2 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 active:scale-98",
    outline:
      "h-10 px-4 py-2 border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 active:scale-98",
    ghost:
      "h-10 px-4 py-2 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
    danger:
      "h-10 px-4 py-2 bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-500/10 active:scale-98",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

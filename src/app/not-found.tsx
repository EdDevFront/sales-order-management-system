import Link from "next/link";
import { ShoppingCart, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-xl bg-indigo-50 p-6 dark:bg-indigo-950/20">
        <ShoppingCart className="mx-auto h-16 w-16 text-indigo-400 dark:text-indigo-500" />
      </div>
      <h1 className="mt-8 text-6xl font-bold tracking-tight text-zinc-900 dark:text-white">
        404
      </h1>
      <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
        Página não encontrada
      </p>
      <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
        A página que você procura não existe ou foi movida.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
      >
        <Home className="h-4 w-4" />
        Voltar ao Dashboard
      </Link>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Truck, Package, ShoppingCart, History, Menu, X } from "lucide-react";

import Toast from "./Toast";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { id: "dashboard", href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", href: "/orders", label: "Pedidos de Venda", icon: ShoppingCart },
  { id: "customers", href: "/customers", label: "Clientes", icon: Users },
  { id: "transports", href: "/transports", label: "Tipos de Transporte", icon: Truck },
  { id: "items", href: "/items", label: "Itens", icon: Package },
  { id: "audit", href: "/audit", label: "Auditorias", icon: History },
];

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2.5 text-white shadow-lg shadow-indigo-500/20">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Portal OVGS</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Gestão de Pedidos de Venda & Logística</p>
            </div>
          </div>
          <nav className="flex gap-1.5 max-md:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Collapsible Mobile Menu panel */}
        {isMobileMenuOpen && (
          <div className="border-t border-zinc-200/50 bg-white/95 backdrop-blur-md px-4 py-3 space-y-1 md:hidden dark:border-zinc-800/50 dark:bg-zinc-900/95">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
        <Toast />
      </main>

      <footer className="border-t border-zinc-200/50 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800/50 dark:text-zinc-400">
        © {new Date().getFullYear()} OVGS. Todos os direitos reservados. Desafio Frontend Senior.
      </footer>
    </div>
  );
}

"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/application/store";
import { setActiveTab } from "@/application/store/uiSlice";
import { LayoutDashboard, Users, Truck, Package, ShoppingCart, History } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Sales Orders", icon: ShoppingCart },
  { id: "customers", label: "Customers", icon: Users },
  { id: "transports", label: "Transport Types", icon: Truck },
  { id: "items", label: "Items", icon: Package },
  { id: "audit", label: "Audits", icon: History },
];

export default function Layout({ children }: LayoutProps) {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.ui.activeTab);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2.5 text-white shadow-lg shadow-indigo-500/20">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">OVGS Portal</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Sales Order Management & Logistics</p>
            </div>
          </div>
          <nav className="flex gap-1.5 max-sm:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => dispatch(setActiveTab(item.id))}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="border-t border-zinc-200/50 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800/50 dark:text-zinc-400">
        © {new Date().getFullYear()} OVGS. All rights reserved. Senior Frontend Challenge.
      </footer>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-bold text-slate-900 dark:text-white"
            >
              Finances App
            </Link>
            <div className="flex gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

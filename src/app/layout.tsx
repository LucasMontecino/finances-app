import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { FinanceProvider } from "@/context/FinanceContext";
import Navigation from "@/components/layout/Navigation";
import DatabaseErrorBanner from "@/components/layout/DatabaseErrorBanner";

export const metadata: Metadata = {
  title: "Finances App - Track Your Money",
  description:
    "Track your expenses, incomes, liabilities, assets, and balance in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <FinanceProvider>
          <Toaster position="top-right" richColors closeButton />
          <Navigation />
          <DatabaseErrorBanner />
          {children}
        </FinanceProvider>
      </body>
    </html>
  );
}

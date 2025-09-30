import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./../styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Balance - Inventory Management",
  description: "A simple inventory management app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Clases base para los colores de fondo y texto de toda la app */}
      <body className={`${inter.className} bg-gray-200 dark:bg-black/70 text-slate-800 dark:text-slate-200 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
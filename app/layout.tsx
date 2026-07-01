import "./globals.css";

import HeroProvider from "@/providers/HeroUIProvider";
import QueryProvider from "@/providers/QueryProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import AuthProvider from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#1E293B] text-white min-h-screen">

        <ThemeProvider>
          <HeroProvider>
            <QueryProvider>
              <AuthProvider>
                {children}
                <Toaster position="top-right" />
              </AuthProvider>
            </QueryProvider>
          </HeroProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
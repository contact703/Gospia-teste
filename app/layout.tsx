import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { ClientLayout } from "@/components/ClientLayout";
import { ThemeProvider } from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GospIA - Ouvir você é minha missão",
  description: "Seu conselheiro pastoral virtual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
        >
          <UserProvider>
            <ClientLayout>{children}</ClientLayout>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

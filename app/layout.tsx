import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { Nunito_Sans } from 'next/font/google';
import { ThemeProvider } from "@/components/website/theme-provider"
import { Toaster } from "@/components/ui/sonner"

// Configure Nunito Sans with the weights you want to use
const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-nunito-sans',
});

export const metadata: Metadata = {
  title: "Unicent | Personal Finance Manager",
  description: "Manage your finances, track expenses and incomes, and get insights into your spending habits with Unicent.",
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunitoSans.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

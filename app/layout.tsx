import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { Nunito_Sans } from 'next/font/google';

// Configure Nunito Sans with the weights you want to use
const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  // Include the weights you showed in the image: Regular (400), Medium (500), and Bold (700)
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
        className={`${nunitoSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const brightFont = localFont({
  src: "./fonts/Bright.otf",
  variable: "--font-bright",
});

export const metadata: Metadata = {
  title: "The Littlewoods 2026",
  description: "Dylan and Jess' wedding website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${brightFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

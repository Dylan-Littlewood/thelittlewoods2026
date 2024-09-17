import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        {children}
      </body>
    </html>
  );
}

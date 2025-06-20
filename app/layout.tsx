import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lets talk EthCC",
  description: "Generate your ENS based Business card",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} antialiased overflow-x-hidden`}
      >
        <Providers>
          <main className="w-full h-full p-5 min-h-screen overflow-x-hidden">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

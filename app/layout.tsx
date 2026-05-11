import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { serverEnv } from "@/utils/config/serverEnv";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LetsTalk.eth",
  description: "Generate your ENS based Business card",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <Providers jawApiKey={serverEnv.justaNameApiKey}>
          <main className="h-[100dvh]">
            {children}
          </main>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

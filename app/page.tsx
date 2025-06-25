import { DisplaySection } from "@/components/displaySection";
import { serverEnv } from "@/utils/config/serverEnv";
import { Metadata, Viewport } from "next";

const title = "Let's Talk"
const description = "Check out ENS profile on Let's Talk"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  colorScheme: "light",
}

export const metadata: Metadata = {
  title,
  description,
  keywords: ["ENS", "Ethereum", "Web3", "Profile", "Social", "Blockchain"],
  authors: [{ name: "Let's Talk" }],
  creator: "Let's Talk",
  publisher: "Let's Talk",

  // Open Graph metadata
  openGraph: {
    type: "profile",
    title,
    description,
    siteName: "Let's Talk",
    locale: "en_US",
    images: [
      {
        url: `${serverEnv.justaNameOrigin}/og.webp`,
        width: 1200,
        height: 630,
        alt: `Let's Talk profile card`,
        type: "image/png",
      },
    ],
  },

  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    site: "@letstalk", // Replace with your Twitter handle
    creator: "@letstalk", // Replace with your Twitter handle
    title,
    description,
    images: [
      {
        url: `${serverEnv.justaNameOrigin}/og.webp`,
        alt: `Let's Talk profile card`,
        width: 1200,
        height: 630,
      },
    ],
  },

  // Additional metadata for other platforms
  other: {
    // WhatsApp
    "og:image:width": "1200",
    "og:image:height": "630",

    // LinkedIn
    "article:author": "Let's Talk",

    // Discord
    "theme-color": "#6366f1",

    // Telegram
    "telegram:channel": "@letstalk", // Replace with your channel

    // Additional SEO
    robots: "index,follow",
    googlebot: "index,follow",
    bingbot: "index,follow",
  },

  // Verification and ownership
  verification: {
    // Add your verification tokens here
    // google: "your-google-verification-token",
    // yandex: "your-yandex-verification-token",
    // yahoo: "your-yahoo-verification-token",
  },

  // App-specific metadata
  applicationName: "Let's Talk",
  referrer: "origin-when-cross-origin",

  // Icons and manifest
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  // manifest: "/site.webmanifest",

  // Additional structured data
  category: "Social Network",
}

export default async function HomePage() {

  const displayEns = "ens.eth";
  return (
    <DisplaySection homePage ens={displayEns} />
  );
} 
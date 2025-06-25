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
  keywords: [
    "ENS business card",
    "Ethereum Name Service",
    "Web3 profile",
    "ENS card creator",
    "blockchain identity",
    "crypto business card",
    "decentralized profile",
    "ENS domain showcase",
    "Web3 networking",
    "digital business card",
    "ENS social profile",
    "letstalk.eth",
    "professional Web3 identity"
  ],
  authors: [{ name: "Let's Talk", url: "https://letstalk.eth" }],
  creator: "Let's Talk - ENS Business Card Platform",
  publisher: "Let's Talk",

  // Enhanced Open Graph metadata
  openGraph: {
    type: "website",
    title: "Let's Talk - Create Your ENS Business Card | Web3 Professional Profiles",
    description: "Transform your ENS domain into a professional business card. Connect your Web3 identity with customizable profiles, social links, and shareable QR codes.",
    siteName: "Let's Talk",
    locale: "en_US",
    url: serverEnv.justaNameOrigin,
    images: [
      {
        url: `${serverEnv.justaNameOrigin}/og.webp`,
        width: 1200,
        height: 630,
        alt: "Let's Talk - ENS Business Card Platform - Create professional Web3 profiles",
        type: "image/webp",
      },
    ],
  },

  // Enhanced Twitter metadata
  twitter: {
    card: "summary_large_image",
    site: "@justaname_id",
    creator: "@justaname_id",
    title: "Create Your ENS Business Card | Let's Talk",
    description: "Transform your ENS domain into a professional business card. Connect, share, and showcase your Web3 identity.",
    images: [
      {
        url: `${serverEnv.justaNameOrigin}/og.webp`,
        alt: "Let's Talk ENS Business Card Platform",
        width: 1200,
        height: 630,
      },
    ],
  },

  // Additional metadata for other platforms
  other: {
    // WhatsApp & Telegram
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/webp",

    // LinkedIn
    "article:author": "just-a-lab",
    "article:section": "Technology",
    "article:tag": "ENS, Web3, Blockchain, Business Cards, Professional Networking",

    // Discord
    "theme-color": "#6366f1",

    // Telegram
    "telegram:channel": "@justaname_id",

    // Enhanced SEO
    robots: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    googlebot: "index,follow,max-image-preview:large,max-snippet:-1",
    bingbot: "index,follow",

    // Schema.org structured data
    "application-name": "Let's Talk",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Let's Talk",
    "format-detection": "telephone=no",

    // Additional social platforms
    "pinterest:description": "Create professional ENS business cards and showcase your Web3 identity with Let's Talk platform.",
  },

  applicationName: "Let's Talk",
  referrer: "origin-when-cross-origin",

  // Enhanced robots configuration
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icons and manifest
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon-16x16.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",

  // Additional structured data
  category: "Professional Networking",
  classification: "Web3 Business Tools",

  // Canonical URL
  alternates: {
    canonical: serverEnv.justaNameOrigin,
    languages: {
      'en-US': serverEnv.justaNameOrigin,
      'x-default': serverEnv.justaNameOrigin,
    },
  },
}


export default async function HomePage() {

  const displayEns = "ens.eth";
  return (
    <DisplaySection homePage ens={displayEns} />
  );
} 
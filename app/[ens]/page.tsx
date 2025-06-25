import { DisplaySection } from "@/components/displaySection";
import { getStandardRecords } from "@/lib/ens";
import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    colorScheme: "light",
}

export async function generateMetadata({ params }: { params: Promise<{ ens: string }> }): Promise<Metadata> {
    const { ens } = await params;
    const displayEns = decodeURIComponent(ens)

    const profile = await getStandardRecords(displayEns)

    const ogParams = new URLSearchParams({
        ens: profile.ens,
        address: profile.address,
    })

    if (profile.bio) ogParams.set("bio", profile.bio)
    if (profile.followers) ogParams.set("followers", profile.followers?.toString())
    if (profile.following) ogParams.set("following", profile.following?.toString())
    if (profile.website) ogParams.set("website", profile.website)
    if (profile.avatar) ogParams.set("avatar", profile.avatar)
    if (profile.header) ogParams.set("header", profile.header)
    if (profile.display) ogParams.set("display", profile.display)
    if (profile.telegram) ogParams.set("telegram", profile.telegram)
    if (profile.x) ogParams.set("x", profile.x)
    if (profile.github) ogParams.set("github", profile.github)
    if (profile.discord) ogParams.set("discord", profile.discord)

    const ogImageUrl = `/api/og?${ogParams.toString()}`

    const title = `${profile.ens} - Let's Talk Profile`
    const description = profile.bio || `Check out ${profile.ens}'s profile on Let's Talk`

    return {
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
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: `${profile.ens} profile card`,
                    type: "image/png",
                },
            ],
        },

        // Twitter metadata
        twitter: {
            card: "summary_large_image",
            site: "@justaname_id",
            creator: "@justaname_id",
            title,
            description,
            images: [
                {
                    url: ogImageUrl,
                    alt: `${profile.ens} profile card`,
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
            "article:author": "just-a-lab",

            // Discord
            "theme-color": "#6366f1",

            // Telegram
            "telegram:channel": "@justaname_id",

            // Additional SEO
            robots: "index,follow",
            googlebot: "index,follow",
            bingbot: "index,follow",
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
}
export default async function EnsPage({ params }: { params: Promise<{ ens: string }> }) {
    const { ens } = await params;
    return (
        <DisplaySection ens={decodeURIComponent(ens)} />
    );
} 
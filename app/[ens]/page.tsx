import { DisplaySection } from "@/components/displaySection";
import { getStandardRecords } from "@/lib/ens";
import { Metadata, Viewport } from "next";
import {serverEnv} from "@/utils/config/serverEnv";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    colorScheme: "light",
}

export async function generateMetadata({params}: { params: Promise<{ ens: string }> }): Promise<Metadata> {
    const {ens} = await params;
    const displayEns = decodeURIComponent(ens)

    try {
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

        // Enhanced title with better SEO structure
        const displayName = profile.display || profile.ens
        const title = `${displayName} | ENS Profile & Business Card on Let's Talk`

        // Enhanced description with more context
        const profileDescription = profile.bio
            ? `${profile.bio.slice(0, 120)}${profile.bio.length > 120 ? '...' : ''}`
            : `Professional Web3 profile and ENS business card for ${displayName}. Connect with ${profile.ens} on the blockchain.`

        const description = `${profileDescription} | View ${displayName}'s complete ENS profile, social links, and contact information. Follow ${profile.followers || 0} | Following ${profile.following || 0}`

        // Enhanced keywords based on profile data
        const profileKeywords: string[] = [
            "ENS profile",
            "Web3 identity",
            "blockchain profile",
            "ENS business card",
            profile.ens,
            displayName !== profile.ens ? displayName : undefined,
            profile.github ? "GitHub developer" : undefined,
            profile.x ? "Twitter Web3" : undefined,
            profile.telegram ? "Telegram crypto" : undefined,
            profile.discord ? "Discord community" : undefined,
            "Ethereum Name Service",
            "decentralized identity",
            "crypto professional",
            "Web3 networking"
        ].filter((keyword): keyword is string => typeof keyword === 'string')


        return {
            title,
            description,
            keywords: profileKeywords,
            authors: [{name: displayName, url: `${serverEnv.justaNameOrigin}/${profile.ens}`}],
            creator: displayName,
            publisher: "Let's Talk",

            // Enhanced Open Graph metadata
            openGraph: {
                type: "profile",
                title,
                description,
                siteName: "Let's Talk - ENS Business Cards",
                locale: "en_US",
                url: `${serverEnv.justaNameOrigin}/${profile.ens}`,
                images: [
                    {
                        url: ogImageUrl,
                        width: 1200,
                        height: 630,
                        alt: `${displayName} (${profile.ens}) - ENS Profile Card | Professional Web3 Identity`,
                        type: "image/png",
                    },
                ],
            },

            // Enhanced Twitter metadata
            twitter: {
                card: "summary_large_image",
                site: "@justaname_id",
                creator: profile.x ? `@${profile.x}` : "@justaname_id",
                title: `${displayName} | ENS Profile on Let's Talk`,
                description: profileDescription,
                images: [
                    {
                        url: ogImageUrl,
                        alt: `${displayName} ENS profile card - ${profile.ens}`,
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
                "og:image:type": "image/png",

                // Enhanced profile metadata
                "profile:username": profile.ens,
                "article:author": displayName,
                "article:section": "Web3 Profiles",
                "article:tag": `ENS, ${profile.ens}, Web3, Blockchain, Profile`,

                // LinkedIn specific
                "linkedin:owner": profile.ens,

                // Discord
                "theme-color": "#6366f1",

                // Telegram
                "telegram:channel": "@justaname_id",

                // Enhanced SEO
                robots: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
                googlebot: "index,follow,max-image-preview:large,max-snippet:-1",
                bingbot: "index,follow",

                // Additional social platform metadata
                "pinterest:description": `${displayName}'s professional ENS profile and Web3 business card. Connect on the blockchain.`,

                // Profile-specific metadata
                "al:web:url": `${serverEnv.justaNameOrigin}/${profile.ens}`,
                "parsely-title": title,
                "parsely-type": "profile",
                "parsely-author": displayName,
            },

        // App-specific metadata
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
                icon: "/favicon.ico",
                shortcut: "/favicon-16x16.png",
                apple: "/apple-touch-icon.png",
            },

            // Additional structured data
            category: "Professional Profile",
            classification: "Web3 Identity",

            // Canonical and alternate URLs
            alternates: {
                canonical: `${serverEnv.justaNameOrigin}/${profile.ens}`,
                languages: {
                    'en-US': `${serverEnv.justaNameOrigin}/${profile.ens}`,
                    'x-default': `${serverEnv.justaNameOrigin}/${profile.ens}`,
                },
            },
        }
    } catch {
        // Fallback metadata for invalid or non-existent ENS names
        const title = `${displayEns} | ENS Profile Not Found | Let's Talk`
        const description = `The ENS profile for ${displayEns} could not be found. Create your own ENS business card on Let's Talk - the professional Web3 identity platform.`

        return {
            title,
            description,
            keywords: ["ENS not found", "Web3 profile", "ENS business card", "create ENS profile", displayEns],
            authors: [{name: "Let's Talk"}],
            creator: "Let's Talk",
            publisher: "Let's Talk",

            openGraph: {
                type: "website",
                title,
                description,
                siteName: "Let's Talk",
                locale: "en_US",
                url: `${serverEnv.justaNameOrigin}/${displayEns}`,
                images: [
                    {
                        url: `${serverEnv.justaNameOrigin}/og-not-found.webp`,
                        width: 1200,
                        height: 630,
                        alt: `ENS profile not found - Create your Web3 business card`,
                        type: "image/webp",
                    },
                ],
            },

            twitter: {
                card: "summary_large_image",
                site: "@justaname_id",
                creator: "@justaname_id",
                title,
                description,
                images: [
                    {
                        url: `${serverEnv.justaNameOrigin}/og-not-found.webp`,
                        alt: `ENS profile not found - ${displayEns}`,
                        width: 1200,
                        height: 630,
                    },
                ],
            },

            other: {
                robots: "noindex,follow", // Don't index non-existent profiles
                googlebot: "noindex,follow",
                bingbot: "noindex,follow",
            },

            robots: {
                index: false, // Don't index pages that don't exist
                follow: true,
            },
        }
    }
}

export default async function EnsPage({params}: { params: Promise<{ ens: string }> }) {
    const {ens} = await params;
    return (
        <DisplaySection ens={decodeURIComponent(ens)}/>
    );
} 
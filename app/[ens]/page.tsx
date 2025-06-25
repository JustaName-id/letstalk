
import { DisplaySection } from "@/components/displaySection";
import {Metadata} from "next";

// const getStandardRecords = async (
//     _params: SubnameRecordsRoute['params']
// ): Promise<Records> => {
//   if (!ensClient) {
//     throw new Error('Public client not found');
//   }
//
//   const __ens = normalizeEns(_params.ens) || _ens;
//
//   if (!__ens) {
//     throw new Error('Invalid ENS name');
//   }
//
//   if (!validateEns(__ens)) {
//     throw new Error('Invalid ENS name');
//   }
//
//   const result = await getEnsRecords(ensClient, {
//     name: __ens,
//     coins: Object.keys(coinTypeMap),
//     texts: [
//       ...generalKeys,
//       ...SUPPORTED_SOCIALS.map((social) => social.identifier),
//     ],
//     contentHash: true,
//   });
//
//   const __chainId = _params?.chainId || _chainId;
//
//   const offchainResolver = offchainResolvers?.offchainResolvers?.find(
//       (resolver) => resolver.chainId === __chainId
//   );
//
//   const record = {
//     ens: __ens,
//     isJAN: result.resolverAddress === offchainResolver?.resolverAddress,
//     records: {
//       ...result,
//       contentHash: {
//         protocolType: result.contentHash?.protocolType || '',
//         decoded: result.contentHash?.decoded || '',
//       },
//     },
//   };
//
//   checkEnsValid(record);
//
//   const sanitized = sanitizeRecords(record);
//
//   return {
//     ...record,
//     sanitizedRecords: sanitized,
//   };
// };

const getEnsProfile = async (ens: string):Promise < {
    ens: string;
    address: string;
    bio: string | null;
    followers: number | null;
    following: number | null;
    website: string | null;
    avatar: string | null;
}> => {
    // TODO: Implement your ENS record fetching logic here
    // This should return the profile data from your ENS records
    return {
        ens: ens,
        address: "0x1234...5678", // Replace with actual address
        bio: null, // Will be null if not set
        followers: null,
        following: null,
        website: null,
        avatar: null,
        // Add other fields as needed
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const displayEns = "ens.eth"

    // Fetch the profile data
    const profile = await getEnsProfile(displayEns)

    // Build OG image URL with only available data
    const ogParams = new URLSearchParams({
        ens: profile.ens,
        address: profile.address,
    })

    // Only add optional parameters if they exist
    if (profile.bio) ogParams.set("bio", profile.bio)
    if (profile.followers) ogParams.set("followers", profile.followers?.toString())
    if (profile.following) ogParams.set("following", profile.following?.toString())
    if (profile.website) ogParams.set("website", profile.website)
    if (profile.avatar) ogParams.set("avatar", profile.avatar)

    const ogImageUrl = `/api/og?${ogParams.toString()}`

    const title = `${profile.ens} - Let's Talk Profile`
    const description = profile.bio || `Check out ${profile.ens}'s profile on Let's Talk`

    return {
        title,
        description,
        keywords: ["ENS", "Ethereum", "Web3", "Profile", "Social", "Blockchain"],
        authors: [{name: "Let's Talk"}],
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
            site: "@letstalk", // Replace with your Twitter handle
            creator: "@letstalk", // Replace with your Twitter handle
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
            "article:author": profile.ens,

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
        colorScheme: "light",
        viewport: {
            width: "device-width",
            initialScale: 1,
            maximumScale: 1,
        },

        // Icons and manifest
        icons: {
            icon: "/favicon.ico",
            shortcut: "/favicon-16x16.png",
            apple: "/apple-touch-icon.png",
        },
        manifest: "/site.webmanifest",

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
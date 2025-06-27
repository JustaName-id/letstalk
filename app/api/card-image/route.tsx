import { serverEnv } from "@/utils/config/serverEnv"
import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"
import QRCode from "qrcode"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const ens = searchParams.get("ens")
        const address = searchParams.get("address")
        const avatar = searchParams.get("avatar")
        const header = searchParams.get("header")
        const aspectRatio = Number(searchParams.get("aspectRatio")) || 0.625 // Default based on your 2400 width

        if (!ens || !address) {
            return new Response("ENS name and address are required", { status: 400 })
        }

        // Generate QR code as data URL
        const qrCodeUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL || "https://localhost:3000"}/${ens}`

        const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, {
            width: 600,
            margin: 1,
            color: {
                dark: "#000000",
                light: '#0000'
            },
        })

        // Calculate responsive dimensions while maintaining your aspect ratio logic
        const baseWidth = 2400 // More standard base width
        const width = baseWidth
        const height = Math.round(baseWidth / aspectRatio)

        console.log(`Generating image: ${width}x${height} (aspect ratio: ${aspectRatio})`)

        return new ImageResponse(
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8fafc",
                    position: "relative",
                }}
            >
                {/* Address pattern background - keeping your original style */}
                <div
                    style={{
                        position: "absolute",
                        top: "0",
                        left: "10px",
                        right: "0",
                        transform: "translate(0, 0)",
                        fontSize: `${Math.max(60, width * 0.05)}px`, // Responsive font size
                        fontWeight: "bold",
                        color: "rgba(148, 163, 184, 0.1)",
                        zIndex: 0,
                        whiteSpace: "normal",
                        wordBreak: "break-all",
                        overflow: "hidden",
                    }}
                >
                    {Array.from({ length: 30 }, (_, i) => i)
                        .map(() => address)
                        .join("")}
                </div>

                {/* Card Container - keeping your original design */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        backgroundColor: "white",
                        borderRadius: "48px",
                        padding: "10px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        width: "80%",
                        height: "45%",
                        border: "3px solid #E4E4E7",
                        zIndex: 1,
                        position: "relative",
                    }}
                >
                    {/* Header section - keeping your original style */}
                    <div
                        style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            right: "0",
                            bottom: "70%",
                            display: "flex",
                        }}
                    >
                        <img
                            src={header || `${serverEnv.justaNameOrigin}/banner/fallback.png`}
                            alt="Header"
                            style={{
                                width: "100%",
                                height: "100%",
                                borderTopLeftRadius: "32px",
                                borderTopRightRadius: "32px",
                                objectFit: "cover",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                top: "0",
                                left: "0",
                                right: "0",
                                bottom: "0",
                                background: "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)",
                                borderTopLeftRadius: "32px",
                                borderTopRightRadius: "32px",
                            }}
                        />
                    </div>

                    {/* QR Code - keeping your original style */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flex: 1,
                            marginTop: "20px",
                        }}
                    >
                        <img
                            src={qrCodeDataUrl || "/placeholder.svg"}

                            style={{
                                // width: `${Math.min(width * 0.2, height * 0.3)}px`,
                                // height: `${Math.min(width * 0.2, height * 0.3)}px`,
                                height:"100%",
                                aspectRatio: 1,
                                borderRadius: "48px",
                            }}
                        />
                    </div>

                    {/* Bottom section with avatar and info - keeping your original style */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "4px",
                            padding: "3px 0",
                            // border: "1px solid #000000"
                        }}
                    >
                        <img
                            src={avatar || `${serverEnv.justaNameOrigin}/avatar/fallback.webp`}
                            alt="avatar"
                            style={{
                                borderRadius: "160px",
                                width: "20%",
                                aspectRatio: 1,
                            }}
                        />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                flex: 1,
                                maxWidth: "70%",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: `${Math.max(40, width * 0.033)}px`, // Responsive but maintains proportion
                                    fontWeight: "normal",
                                    color: "#000",
                                }}
                            >
                                {ens}
                            </div>
                            <div
                                style={{
                                    fontSize: `${Math.max(24, width * 0.02)}px`, // Responsive but maintains proportion
                                    fontWeight: "bold",
                                    color: "#666",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    display: "flex",
                                }}
                            >
                                {(address || "").slice(0, 12)}...{(address || "").slice(32, 44)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
            {
                width,
                height,
            },
        )
    } catch (e: unknown) {
        console.log(`${e instanceof Error ? e.message : "Unknown error"}`)
        return new Response(`Failed to generate the image`, {
            status: 500,
        })
    }
}
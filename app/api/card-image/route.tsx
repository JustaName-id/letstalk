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


        if (!ens || !address) {
            return new Response("ENS name and address are required", { status: 400 })
        }

        const qrCodeUrl = `${serverEnv.justaNameOrigin}/${ens}`
        const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, {
            width: 300,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        })

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
                {/* Address pattern background */}
                <div
                    style={{
                        position: "absolute",
                        top: "0",
                        left: "10px",
                        right: "0",
                        transform: "translate(0, 0)",
                        fontSize: "80px",
                        fontWeight: "bold",
                        color: "rgba(148, 163, 184, 0.1)",
                        zIndex: 0,
                        whiteSpace: "normal",
                        wordBreak: "break-all",
                        overflow: "hidden",
                    }}
                >
                    {`${address}${address}${address}`}
                </div>

                {/* Card Container */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "10px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        width: "350px",
                        height: "430px",
                        border: "3px solid #E4E4E7",
                        zIndex: 1,
                        position: "relative",
                    }}
                >
                    <div style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        right: "0",
                        bottom: "80%",
                        display: "flex",
                    }}>
                        <img src={header ?? `${serverEnv.justaNameOrigin}/banner/fallback.png`} alt="Header" style={{
                            width: "100%",
                            height: "100%",
                            borderTopLeftRadius: "9px",
                            borderTopRightRadius: "9px",
                            objectFit: "cover",
                        }} />
                        <div style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            right: "0",
                            bottom: "0",
                            background: "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)",
                            borderTopLeftRadius: "9px",
                            borderTopRightRadius: "9px",
                        }} />
                    </div>
                    {/* QR Code */}
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        marginTop: "20px"
                    }}>
                        <img
                            src={qrCodeDataUrl}
                            style={{
                                width: "250px",
                                height: "250px",
                                borderRadius: "12px"
                            }}
                        />
                    </div>

                    {/* Bottom section with avatar and info */}
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "4px",
                        padding: "10px 0"
                    }}>
                        <img
                            src={avatar || `${serverEnv.justaNameOrigin}/avatar/fallback.webp`}
                            alt="avatar"
                            width="80"
                            height="80"
                            style={{
                                borderRadius: "40px",
                            }}
                        />
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            flex: 1,
                            maxWidth: "70%"
                        }}>
                            <div style={{
                                fontSize: "20px",
                                fontWeight: "normal",
                                color: "#000"
                            }}>
                                {ens}
                            </div>
                            <div style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                                color: "#666",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                display: "flex",
                            }}>
                                {(address || "").slice(0, 12)}...{(address || "").slice(32, 44)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
            {
                width: 600,
                height: 900,
            },
        )
    } catch (e: unknown) {
        console.log(`${e instanceof Error ? e.message : 'Unknown error'}`)
        return new Response(`Failed to generate the image`, {
            status: 500,
        })
    }
} 
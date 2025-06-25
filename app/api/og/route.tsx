import { DiscordIcon, GithubIcon, GlobeIcon, LetsTalkIcon, TelegramIcon, XIcon } from "@/lib/icons"
import { serverEnv } from "@/utils/config/serverEnv"
import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"


const socialCard = (name: string, value: string, icon: React.ReactNode, isFullWidth: boolean = false) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            borderRadius: "6px",
            gap: "8px",
            background: "#FAFAFA",
            padding: "16px",
            flex: isFullWidth ? "1" : "1",
        }}>
            {icon}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                color: "#18181B",
            }}>
                <div style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                }}>
                    {name}
                </div>
                <div style={{
                    fontSize: "14px",
                    fontWeight: "normal",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}>
                    {value}
                </div>
            </div>
        </div>
    )
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const ens = searchParams.get("ens")
        const address = searchParams.get("address")

        if (!ens || !address) {
            return new Response("ENS name and address are required", { status: 400 })
        }

        const bio = searchParams.get("bio")
        const followers = searchParams.get("followers")
        const following = searchParams.get("following")
        const website = searchParams.get("website")
        const avatarUrl = searchParams.get("avatar")
        const header = searchParams.get("header")
        const display = searchParams.get("display")
        const telegram = searchParams.get("telegram")
        const x = searchParams.get("x")
        const github = searchParams.get("github")
        const discord = searchParams.get("discord")


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
                    backgroundImage:
                        "radial-gradient(circle at 25px 25px, #e2e8f0 2px, transparent 0), radial-gradient(circle at 75px 75px, #e2e8f0 2px, transparent 0)",
                    backgroundSize: "100px 100px",
                    padding: "40px",
                    position: "relative",
                }}
            >
                {/* Address in background */}
                <div
                    style={{
                        position: "absolute",
                        top: "0",
                        left: "10px",
                        right: "0",
                        transform: "translate(0, 0)",
                        fontSize: "120px",
                        fontWeight: "bold",
                        color: "rgba(148, 163, 184, 0.1)",
                        zIndex: 0,
                        whiteSpace: "normal",
                        wordBreak: "break-all",
                        overflow: "hidden",
                    }}
                >
                    {`${address}${address}`}
                </div>

                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "40px",
                        zIndex: 1,
                    }}
                >
                    <LetsTalkIcon style={{ width: "320px", height: "60px" }} />
                </div>

                {/* Main Card */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: "20px",
                        backgroundColor: "white",
                        borderRadius: "18px",
                        padding: "28px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        width: "800px",
                        border: "1px solid #e2e8f0",
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
                            borderTopLeftRadius: "17px",
                            borderTopRightRadius: "17px",
                            objectFit: "cover",
                        }} />
                        <div style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            right: "0",
                            bottom: "0",
                            background: "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)",
                            borderTopLeftRadius: "17px",
                            borderTopRightRadius: "17px",
                        }} />
                    </div>
                    {/* Left side */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "8px",
                        height: "100%",
                        width: "49%",
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "10px",
                        }}>
                            <div
                                style={{
                                    width: "120px",
                                    height: "120px",
                                    borderRadius: "60px",
                                    backgroundColor: "#e0f2fe",
                                    backgroundImage: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "4px solid white",
                                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        width="112"
                                        height="112"
                                        style={{
                                            borderRadius: "56px",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            fontSize: "48px",
                                            color: "white",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {ens.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Display name and ENS */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div
                                    style={{
                                        fontSize: "30px",
                                        fontWeight: "bold",
                                        color: "#1e293b",
                                        marginBottom: followers || following ? "16px" : "0px",
                                    }}
                                >
                                    {display || ens}
                                </div>
                                {display && (
                                    <div style={{
                                        fontSize: "18px",
                                        color: "#64748b",
                                    }}>
                                        {ens}
                                    </div>
                                )}

                            </div>
                        </div>
                        {/* description */}
                        {bio && (
                            <div style={{
                                fontSize: "14px",
                                color: "#64748b",
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}>
                                {bio}
                            </div>
                        )}
                        {/* EFP Stats */}
                        <div style={{
                            gap: "16px",
                            display: "flex",
                            borderRadius: "6px",
                            background: "#FAFAFA",
                            padding: "16px",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "auto"
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                gap: "8px",
                            }}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                    <div style={{
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        color: "#18181B",
                                    }}>
                                        {followers ?? 0}
                                    </div>
                                    <div style={{
                                        fontSize: "12px",
                                        color: "#71717A",
                                    }}>
                                        Followers
                                    </div>

                                </div>
                                <div style={{
                                    width: "1px",
                                    height: "40px",
                                    background: "#E4E4E7",
                                }} />
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                    <div style={{
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        color: "#18181B",
                                    }}>
                                        {following ?? 0}
                                    </div>
                                    <div style={{
                                        fontSize: "12px",
                                        color: "#71717A",
                                    }}>
                                        Following
                                    </div>

                                </div>

                            </div>
                        </div>

                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        width: "50%",
                    }}>
                        {socialCard("Website", website ?? "N/A", <GlobeIcon />, true)}

                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "10px",
                            width: "100%",
                        }}>
                            {socialCard("Telegram", telegram ?? "N/A", <TelegramIcon />, false)}
                            {socialCard("X/Twitter", x ?? "N/A", <XIcon />, false)}
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "10px",
                            width: "100%",
                        }}>
                            {socialCard("Github", github ?? "N/A", <GithubIcon />, false)}
                            {socialCard("Discord", discord ?? "N/A", <DiscordIcon />, false)}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        marginTop: "32px",
                        fontSize: "16px",
                        color: "#94a3b8",
                        zIndex: 1,
                    }}
                >
                    Share your profile • Let&apos;s Talk
                </div>
            </div>,
            {
                width: 1200,
                height: 630,
            },
        )
    } catch (e: unknown) {
        console.log(`${e instanceof Error ? e.message : 'Unknown error'}`)
        return new Response(`Failed to generate the image`, {
            status: 500,
        })
    }
}

import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Only ENS name and address are required
        const ens = searchParams.get("ens")
        const address = searchParams.get("address")

        if (!ens || !address) {
            return new Response("ENS name and address are required", { status: 400 })
        }

        // All other parameters are optional
        const bio = searchParams.get("bio")
        const followers = searchParams.get("followers")
        const following = searchParams.get("following")
        const website = searchParams.get("website")
        const avatarUrl = searchParams.get("avatar")

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
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "120px",
                        fontWeight: "bold",
                        color: "rgba(148, 163, 184, 0.1)",
                        zIndex: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        maxWidth: "100%",
                    }}
                >
                    {address}
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
                    <div
                        style={{
                            fontSize: "48px",
                            fontWeight: "bold",
                            color: "#1e293b",
                            marginRight: "20px",
                        }}
                    >
                        Let's
                    </div>
                    <div
                        style={{
                            fontSize: "48px",
                            fontWeight: "bold",
                            color: "#6366f1",
                        }}
                    >
                        Talk
                    </div>
                </div>

                {/* Main Card */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "white",
                        borderRadius: "24px",
                        padding: "48px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        width: "800px",
                        border: "1px solid #e2e8f0",
                        zIndex: 1,
                    }}
                >
                    {/* Profile Section */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: bio ? "32px" : "0px",
                        }}
                    >
                        {/* Avatar */}
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
                                marginRight: "32px",
                                border: "4px solid white",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl || "/placeholder.svg"}
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

                        {/* Username and Stats */}
                        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                            <div
                                style={{
                                    fontSize: "42px",
                                    fontWeight: "bold",
                                    color: "#1e293b",
                                    marginBottom: followers || following ? "16px" : "0px",
                                }}
                            >
                                {ens}
                            </div>

                            {(followers || following) && (
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "48px",
                                    }}
                                >
                                    {followers && (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <div
                                                style={{
                                                    fontSize: "32px",
                                                    fontWeight: "bold",
                                                    color: "#1e293b",
                                                }}
                                            >
                                                {followers}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "18px",
                                                    color: "#64748b",
                                                }}
                                            >
                                                Followers
                                            </div>
                                        </div>
                                    )}

                                    {following && (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <div
                                                style={{
                                                    fontSize: "32px",
                                                    fontWeight: "bold",
                                                    color: "#1e293b",
                                                }}
                                            >
                                                {following}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "18px",
                                                    color: "#64748b",
                                                }}
                                            >
                                                Following
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    {bio && (
                        <div
                            style={{
                                fontSize: "20px",
                                color: "#64748b",
                                lineHeight: 1.6,
                                marginBottom: website ? "32px" : "0px",
                                maxWidth: "100%",
                            }}
                        >
                            {bio}
                        </div>
                    )}

                    {/* Website */}
                    {website && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "18px",
                                color: "#6366f1",
                                textDecoration: "underline",
                            }}
                        >
                            🌐 {website}
                        </div>
                    )}
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
                    Share your profile • Let's Talk
                </div>
            </div>,
            {
                width: 1200,
                height: 630,
            },
        )
    } catch (e: any) {
        console.log(`${e.message}`)
        return new Response(`Failed to generate the image`, {
            status: 500,
        })
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { serverEnv } from '@/utils/config/serverEnv';
import { normalize } from "viem/ens";

// JustaName's ApiKeyGuard checks the request's `Origin` hostname against the
// project allow list; the SDK's axios call doesn't set one server-side, so we
// forward the browser's Origin directly.
export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const { username, ensDomain, address, signature, message } = body;

    if (!username || !ensDomain || !address || !signature || !message) {
      return NextResponse.json({ message: "Required fields are missing" }, { status: 400 });
    }

    const incomingOrigin = req.headers.get("origin") || req.headers.get("referer") || "";
    const forwardOrigin = incomingOrigin || serverEnv.justaNameOrigin;

    const baseUrl = serverEnv.devMode
      ? "https://api-staging.justaname.id"
      : "https://api.justaname.id";

    try {
      const res = await fetch(`${baseUrl}/ens/v1/subname/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: forwardOrigin,
          "x-api-key": serverEnv.justaNameApiKey,
          "x-address": address,
          "x-signature": signature,
          "x-message": message.replace(/\n/g, "\\n"),
        },
        body: JSON.stringify({
          chainId: serverEnv.chainId,
          ensDomain: normalize(ensDomain),
          text: [],
          addresses: [{ coinType: 60, address }],
          username,
        }),
      });

      const text = await res.text();
      let parsed: unknown = null;
      try { parsed = JSON.parse(text); } catch { /* not JSON */ }

      if (!res.ok) {
        const errMessage =
          (parsed as { result?: { error?: string } })?.result?.error ??
          (parsed as { message?: string })?.message ??
          text ??
          "JustaName request failed";
        console.error("[subnames/add] justaname rejected", {
          status: res.status,
          forwardedOrigin: forwardOrigin,
          body: parsed ?? text,
        });
        return NextResponse.json({ error: errMessage }, { status: res.status });
      }

      const data = (parsed as { result?: { data?: unknown } })?.result?.data ?? parsed;
      return NextResponse.json(data);
    } catch (error) {
      console.error("[subnames/add] fetch failed", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Error" },
        { status: 500 }
      );
    }
};

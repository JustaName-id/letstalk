"use client";

import { clientEnv } from "@/utils/config/clientEnv";
import { jaw } from "@jaw.id/wagmi";
import { JustaNameProvider, JustaNameProviderConfig } from "@justaname.id/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, mainnet, sepolia } from "wagmi/chains";

const justaNameConfig: JustaNameProviderConfig = {
    networks: [{
        chainId: clientEnv.chainId,
        providerUrl: clientEnv.providerUrl
    }],
    dev: clientEnv.devMode,
    config: {
        origin: clientEnv.justaNameOrigin,
        domain: clientEnv.justaNameDomain,
    }
};

const queryClient = new QueryClient();

export function Providers({ children, jawApiKey }: { children: React.ReactNode; jawApiKey: string }) {
    const wagmiConfig = useMemo(() => createConfig({
        chains: [mainnet, sepolia, base],
        connectors: [
            jaw({
                apiKey: jawApiKey,
                appName: "LetsTalk.eth",
                defaultChainId: clientEnv.chainId,
                ens: clientEnv.justaNameEns,
                preference: {
                    showTestnets: clientEnv.devMode,
                },
            }),
        ],
        transports: {
            [mainnet.id]: clientEnv.chainId === mainnet.id ? http(clientEnv.providerUrl) : http(),
            [sepolia.id]: clientEnv.chainId === sepolia.id ? http(clientEnv.providerUrl) : http(),
            [base.id]: http(),
        },
        ssr: true,
    }), [jawApiKey]);

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <JustaNameProvider config={justaNameConfig}>
                    {children}
                </JustaNameProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

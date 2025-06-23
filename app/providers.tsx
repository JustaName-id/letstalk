"use client";
import '@rainbow-me/rainbowkit/styles.css';

import { clientEnv } from "@/utils/config/clientEnv";
import { JustaNameProvider, JustaNameProviderConfig } from "@justaname.id/react";
import { getDefaultConfig, getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { argentWallet, ledgerWallet, trustWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
    appName: 'Lets talk EthCC',
    projectId: 'YOUR_PROJECT_ID',
    wallets: [
        ...wallets,
        {
            groupName: 'Other',
            wallets: [argentWallet, trustWallet, ledgerWallet],
        },
    ],
    chains: [clientEnv.chainId === mainnet.id ? mainnet : sepolia],
    transports: {
        [clientEnv.chainId === mainnet.id ? mainnet.id : sepolia.id]: http(clientEnv.providerUrl),
    },
    ssr: true,
});


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

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <JustaNameProvider config={justaNameConfig}>
                        {children}
                    </JustaNameProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
} 
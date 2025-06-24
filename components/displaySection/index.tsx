"use client"
import { DisplayCard } from "@/components/displayCard";
import { Button } from "@/components/ui/button";
import { EfpStats } from "@/lib/efp";
import { LetsTalkIcon, PenIcon, ShareIcon, SparklesIcon } from "@/lib/icons";
import { clientEnv } from "@/utils/config/clientEnv";
import { SanitizedRecords } from "@justaname.id/sdk";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { SubnamesSection } from "../create/subnamesSection";
import { UpdateEnsSection } from "../create/updateEns";
import { SearchBar } from "./SearchBar";

export interface DisplaySectionProps {
    ens: string;
    className?: string;
    records: SanitizedRecords;
    efpStats?: EfpStats | null;
    homePage?: boolean;
}

export const DisplaySection = ({ ens, className = "", records, efpStats, homePage }: DisplaySectionProps) => {
    const address = useMemo(() => {
        return records?.ethAddress?.value
    }, [records])
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const { openConnectModal } = useConnectModal();
    const { isConnected, address: walletAddress } = useAccount();
    const [subnameDrawerOpen, setSubnameDrawerOpen] = useState(false);
    const [selectedSubname, setSelectedSubname] = useState<string | null>(null);

    const isMyCard = useMemo(() => {
        return walletAddress?.toLowerCase() === address?.toLowerCase();
    }, [walletAddress, address])

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = `${clientEnv.websiteUrl}/${ens}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${ens} - ENS Card`,
                    text: `Check out ${ens}'s ENS card!`,
                    url: url
                });
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    navigator.clipboard.writeText(url);
                }
            }
        } else {
            navigator.clipboard.writeText(url);
        }
    }

    const onUpdateDrawerChange = (open: boolean) => {
        if (!open) {
            setSelectedSubname(null);
            setSubnameDrawerOpen(false);
        }
    }

    return (
        <div onClick={() => !subnameDrawerOpen && !selectedSubname && setIsCardFlipped(!isCardFlipped)} className={`flex flex-col h-[calc(100dvh-8px)] p-4 py-2  max-w-[700px] min-[700px]:mx-auto justify-between items-center relative  ${className}`}>
            {address && (
                <div className="absolute inset-0 h-[100dvh] overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 text-[99px] text-center leading-[90%] font-mono font-bold text-gray-400 opacity-10 break-all overflow-hidden">
                        {address}{address}
                    </div>
                </div>
            )}

            <div className="flex flex-row pointer-events-auto !z-[20] w-full items-center justify-between gap-2">
                <div className="flex flex-row items-center gap-2 w-full">
                    <SearchBar onlyIcon onActiveChange={setIsSearchActive} isSearchActive={isSearchActive} />
                    {!isSearchActive && (
                        <LetsTalkIcon />
                    )}
                </div>
                {!isSearchActive && (
                    <div className="flex flex-row gap-2">
                        <Button asChild variant={"secondary"} onClick={(e) => {
                            e.stopPropagation();
                            setSubnameDrawerOpen(true);
                            if (!isConnected) {
                                openConnectModal?.()
                            }
                        }}>
                            <div className="flex flex-row gap-2 items-center">
                                <SparklesIcon />
                                {isConnected ? "My Cards" : "Make a card!"}
                            </div>
                        </Button>

                    </div>
                )}
            </div>
            {records && (
                <div className="relative translate-y-[-20px] z-10 w-full">
                    <DisplayCard subname={records} ens={ens} isCardFlipped={isCardFlipped} efpStats={efpStats} />
                </div>
            )}
            {homePage ? (
                <div style={{
                    transform: "translateY(-50px)"
                }} className="flex flex-col gap-2 w-full">
                    <h1 className="text-foreground text-[30px] font-normal leading-[90%]">Create your ENS based Business card</h1>
                    <p className="text-base text-gray-500 from-gradient-1-start bg-clip-text leading-[90%]">Connect your wallet, select your ENS, and edit your card!</p>
                </div>
            ) : (
                <div style={{
                    transform: "translateY(-40px)"
                }} className="flex flex-col gap-2 w-full">
                    <p className="text-base text-center text-gray-500 from-gradient-1-start bg-clip-text">Click to see the back!</p>
                    <div className="flex flex-row gap-4 items-center justify-center">
                        <Button variant={"secondary"} onClick={handleShare}>
                            <div className="flex flex-row gap-2 items-center">
                                <ShareIcon />
                                Share
                            </div>
                        </Button>
                        {isMyCard && (
                            <Button asChild variant={"secondary"} onClick={(e) => {
                                e.stopPropagation();
                                if (!isConnected) {
                                    openConnectModal?.()
                                } else {
                                    setSelectedSubname(ens);
                                    setSubnameDrawerOpen(true);
                                }
                            }}>
                                <div className="flex flex-row gap-2 items-center">
                                    <PenIcon />
                                    {"Edit"}
                                </div>
                            </Button>
                        )}
                    </div>
                </div>
            )}
            {isConnected && !selectedSubname &&
                <SubnamesSection onEnsSelect={setSelectedSubname} onEnsDrawerOpen={setSubnameDrawerOpen} ensDrawerOpen={subnameDrawerOpen} />
            }
            {!!selectedSubname && (
                <UpdateEnsSection subname={selectedSubname} onUpdateDrawerOpen={onUpdateDrawerChange} updateDrawerOpen={subnameDrawerOpen} />
            )}

        </div>
    );
}
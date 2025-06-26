"use client"
import { DisplayCard } from "@/components/displayCard";
import { Button } from "@/components/ui/button";
import { checkIfMyCard } from "@/lib/helpers";
import { LetsTalkIcon, PenIcon, RotateIcon, SaveIcon, SparklesIcon } from "@/lib/icons";
import { clientEnv } from "@/utils/config/clientEnv";
import { useEnsAvatar, useOffchainResolvers, useRecords } from "@justaname.id/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { SubnamesSection } from "../create/subnamesSection";
import { UpdateEnsSection } from "../create/updateEns";
import { DisplayCardSkeleton } from "../displayCard/skeleton";
import { SearchBar } from "./SearchBar";

export interface DisplaySectionProps {
    ens: string;
    className?: string;
    homePage?: boolean;
}

export const DisplaySection = ({ ens, className = "", homePage }: DisplaySectionProps) => {
    const { openConnectModal } = useConnectModal();
    const { isConnected, address: walletAddress } = useAccount();
    const { avatar } = useEnsAvatar({
        ens: ens,
        chainId: clientEnv.chainId,
    });

    const { records, isRecordsPending } = useRecords({
        ens: ens,
        chainId: clientEnv.chainId,
    });

    const sanitizedRecords = useMemo(() => records?.sanitizedRecords, [records]);

    const address = useMemo(() => {
        return sanitizedRecords?.ethAddress?.value
    }, [sanitizedRecords])
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [subnameDrawerOpen, setSubnameDrawerOpen] = useState(false);
    const [selectedSubname, setSelectedSubname] = useState<{
        name: string;
        new: boolean;
    } | null>(null);
    const [isCreatingCard, setIsCreatingCard] = useState(false);
    const { offchainResolvers, isOffchainResolversPending } =
        useOffchainResolvers();

    const isMyCard = useMemo(() => {
        if (isOffchainResolversPending || !offchainResolvers) return false;
        if (walletAddress?.toLowerCase() !== address?.toLowerCase()) return false;
        return checkIfMyCard(records?.records.resolverAddress ?? "", offchainResolvers);
    }, [isOffchainResolversPending, offchainResolvers, walletAddress, address, records?.records.resolverAddress])

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!sanitizedRecords) return;
        try {
            setIsCreatingCard(true);

            const params = new URLSearchParams({
                ens: ens,
                address: sanitizedRecords.ethAddress.value,
            });
            if (avatar) {
                params.set('avatar', avatar);
            }
            if (sanitizedRecords.header || sanitizedRecords.banner) {
                params.set('header', sanitizedRecords.header || sanitizedRecords.banner || '');
            }
            const imageUrl = `/api/card-image?${params.toString()}`;

            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error('Failed to generate image');
            }

            const blob = await response.blob();
            const fileName = `${ens}-qr-card.png`;

            // Check if Web Share API is available and supports files (mobile-friendly)
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: blob.type })] })) {
                try {
                    const file = new File([blob], fileName, { type: blob.type });
                    await navigator.share({
                        files: [file],
                        title: `${ens} QR Card`,
                        text: `${ens} ENS Business Card - Scan to visit profile`
                    });
                    return; // Exit early if sharing was successful
                } catch (shareError) {
                    // User cancelled sharing or error occurred, fall back to download
                    console.log('Share cancelled or failed, falling back to download', shareError);
                }
            }

            // Fallback: Regular download for desktop or unsupported browsers
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = fileName;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Failed to save card image:', error);
        } finally {
            setIsCreatingCard(false);
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
                    <div style={{ display: isSearchActive ? "none" : "block", maxWidth: isSearchActive ? 0 : "100%", pointerEvents: isSearchActive ? 'none' : 'auto' }}>
                        <Link href="/">
                            <LetsTalkIcon />
                        </Link>
                    </div>
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
            {isRecordsPending ? (
                <div className="relative translate-y-[-20px] z-10 w-full">
                    <DisplayCardSkeleton />
                </div>
            ) : (
                !records ? (
                    <div className="relative translate-y-[-20px] z-10 w-full">
                        <p className="text-muted-foreground text-center text-[30px] font-normal leading-[90%]">ENS name: {ens} not found or has no records.</p>
                    </div>
                ) :
                    sanitizedRecords && (
                        <div className="relative translate-y-[-20px] z-10 w-full">
                            <DisplayCard subname={sanitizedRecords} ens={ens} isCardFlipped={isCardFlipped} />
                        </div>
                    )
            )}
            {homePage ? (
                <div style={{
                    transform: "translateY(-50px)"
                }} className="flex flex-col gap-2 w-full">
                    <h1 className="text-foreground text-[30px] font-normal leading-[90%]">Create your ENS based Business card</h1>
                    <p className="text-base text-gray-500 from-gradient-1-start bg-clip-text leading-[90%]">Connect your wallet, select your ENS, and edit your card!</p>
                </div>
            ) : (
                records ? (
                    <div style={{
                        transform: "translateY(-40px)"
                    }} className="flex flex-col gap-2 w-full">
                        <div className="flex flex-row gap-2 items-center justify-center">
                            <p className="text-base text-center text-gray-500 from-gradient-1-start bg-clip-text">Click to flip</p>
                            <RotateIcon />
                        </div>
                        <div className="flex flex-row gap-4 items-center justify-center">
                            <Button variant={"secondary"} onClick={handleSave} disabled={isCreatingCard}>
                                <div className="flex flex-row gap-2 items-center">
                                    <SaveIcon />
                                    {isCreatingCard ? "Creating..." : "Save Card"}
                                </div>
                            </Button>
                            {isMyCard && (
                                <Button asChild variant={"secondary"} onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isConnected) {
                                        openConnectModal?.()
                                    } else {
                                        setSelectedSubname({ name: ens, new: false });
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
                ) : <div></div>
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
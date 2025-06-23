"use client"
import { DisplayCard } from "@/components/displayCard";
import { Button } from "@/components/ui/button";
import { EfpStats } from "@/lib/efp";
import { ShareIcon, SparklesIcon } from "@/lib/icons";
import { clientEnv } from "@/utils/config/clientEnv";
import { SanitizedRecords } from "@justaname.id/sdk";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchBar } from "./SearchBar";

export interface DisplaySectionProps {
    ens: string;
    className?: string;
    records: SanitizedRecords;
    display?: boolean;
    efpStats?: EfpStats | null;
}

export const DisplaySection = ({ ens, className, records, display, efpStats }: DisplaySectionProps) => {
    const address = useMemo(() => {
        return records?.ethAddress?.value
    }, [records])
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isCardFlipped, setIsCardFlipped] = useState(false);

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

    return (
        <div onClick={() => setIsCardFlipped(!isCardFlipped)} className={`flex flex-col h-[calc(100dvh-40px)] p-5 max-w-[700px] min-[700px]:mx-auto justify-start items-center relative  ${className}`}>
            {address && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 text-[99px] text-center leading-[90%] font-mono font-bold text-gray-400 opacity-10 break-all overflow-hidden">
                        {address}{address}
                    </div>
                </div>
            )}

            <div className="relative z-[11] flex flex-row gap-2.5 w-full justify-between items-center">
                <div className="flex flex-row w-full items-center gap-2">
                    {!isSearchActive && (
                        <Button onClick={handleShare} variant={"icon"}><ShareIcon /></Button>
                    )}
                    <SearchBar onActiveChange={setIsSearchActive} isSearchActive={isSearchActive} />
                </div>
                {!isSearchActive && (
                    <div className="flex flex-row gap-2">
                        <Link href={`/create`} onClick={(e) => {
                            e.stopPropagation();
                        }} >
                            <Button asChild variant={"secondary"}>
                                <div className="flex flex-row gap-2 items-center">
                                    <SparklesIcon />
                                    Make a card!
                                </div>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
            {records && (
                <div className="relative z-10 w-full">
                    <DisplayCard display={display} subname={records} ens={ens} isCardFlipped={isCardFlipped} efpStats={efpStats} />
                </div>
            )}
            <p className="text-base text-gray-500 from-gradient-1-start bg-clip-text">Click to flip Card</p>
        </div>
    );
}
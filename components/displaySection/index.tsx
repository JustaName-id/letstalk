"use client"
import { DisplayCard } from "@/components/displayCard";
import { Button } from "@/components/ui/button";
import { CopiedIcon, CopyIcon, ShareIcon, SparklesIcon } from "@/lib/icons";
import { clientEnv } from "@/utils/config/clientEnv";
import { SanitizedRecords } from "@justaname.id/sdk";
import Link from "next/link";
import { useMemo, useState } from "react";

export interface DisplaySectionProps {
    ens: string;
    className?: string;
    records: SanitizedRecords;
}

export const DisplaySection = ({ ens, className, records }: DisplaySectionProps) => {
    const [copied, setCopied] = useState(false);
    const address = useMemo(() => {
        return records?.ethAddress?.value
    }, [records])



    const handleCopy = () => {
        navigator.clipboard.writeText(ens);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    const handleShare = async () => {
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
        <div className={`flex flex-col max-w-[700px] min-[700px]:mx-auto h-full w-full justify-between items-center relative ${className}`}>
            {address && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 text-[99px] text-center leading-[90%] font-mono font-bold text-gray-400 opacity-10 break-all whitespace-normal">
                        {address}{address}
                    </div>
                </div>
            )}

            <div className="relative z-10 flex flex-row gap-2.5 w-full justify-between items-center">
                <Button onClick={handleCopy} variant={"icon"}>{copied ? <CopiedIcon /> : <CopyIcon />}</Button>
                <p className="text-[18px] font-normal w-full text-left text-foreground leading-[100%]">{ens}</p>
                <div className="flex flex-row gap-2">
                    <Button onClick={handleShare} variant={"icon"}><ShareIcon /></Button>
                </div>
            </div>
            {records && (
                <div className="relative z-10 w-full">
                    <DisplayCard subname={records} ens={ens} />
                </div>
            )}
            <div className="relative z-10">
                <Link href={`/create`} >
                    <Button asChild variant={"secondary"}>
                        <div className="flex flex-row gap-2 items-center">
                            <SparklesIcon />
                            Make a card!
                        </div>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
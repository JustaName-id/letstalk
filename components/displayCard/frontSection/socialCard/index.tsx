import { DiscordIcon, GithubIcon, GlobeIcon, TelegramIcon, XIcon } from "@/lib/icons";
import Link from "next/link";
import { useMemo } from "react";

export interface SocialCardProps {
    name: string;
    value?: string;
    horizontal?: boolean;
    className?: string;
}

export const SocialCard = ({ name, value, horizontal = false, className = "" }: SocialCardProps) => {

    const Icon = useMemo(() => {
        switch (name) {
            case "Website":
                return <GlobeIcon className="min-w-4 min-h-4" />
            case "Github":
                return <GithubIcon />
            case "Discord":
                return <DiscordIcon />
            case "X/Twitter":
                return <XIcon />
            case "Telegram":
                return <TelegramIcon />
        }
    }, [name])

    const url = useMemo(() => {
        switch (name) {
            case "Website":
                return value
            case "Github":
                return `https://github.com/${value}`
            case "Discord":
                return `https://discord.com/users/${value}`
            case "X/Twitter":
                return `https://x.com/${value}`
            case "Telegram":
                return `https://t.me/${value}`
            default:
                return value
        }
    }, [name, value])

    return (
        <div
            className={`flex flex-col p-2.5 pointer-events-auto gap-1 ${horizontal ? "flex-row" : "flex-col"} bg-sidebar-background rounded-[6px] ${className}`}
        >
            {Icon}
            <div className="flex flex-col gap-0.5 text-secondary-foreground">
                <p className="text-xs font-bold leading-[100%] ">{name}</p>
                {value ? (
                    <Link href={url ?? ""} onClick={(e) => e.stopPropagation()} target="_blank" className="text-sm cursor-pointer underline font-normal leading-[150%] text-ellipsis overflow-hidden whitespace-nowrap max-w-[50vw]">{value}</Link>
                ) : (
                    <p className="text-sm font-normal leading-[150%] text-ellipsis overflow-hidden whitespace-nowrap max-w-[50vw]">N/A</p>
                )}
            </div>
        </div>
    )
}
import { Button } from "@/components/ui/button";
import { EfpStats } from "@/lib/efp";
import Link from "next/link";
import { useMemo } from "react";

export interface EfpCardProps {
    stats?: EfpStats | null;
    ens: string;
    display?: boolean;
}

export const EfpCard = ({ stats, ens, display }: EfpCardProps) => {

    const followers = useMemo(() => {
        return parseInt(stats?.followers_count ?? "0");
    }, [stats]);

    const following = useMemo(() => {
        return parseInt(stats?.following_count ?? "0");
    }, [stats]);

    return (
        <div
            className={`flex flex-row items-center justify-between ${display ? "p-2" : "p-4"} gap-2 bg-sidebar-background rounded-[6px]`}
        >
            <div className="flex flex-row items-center gap-2">
                <div className="flex leading-[108%] flex-col items-center">
                    <p className="font-normal text-foreground text-sm">{followers}</p>
                    <p className="text-[10px] font-bold text-muted-foreground leading-[133%]">Followers</p>
                </div>
                <div className="w-[1px] min-h-full bg-border" />
                <div className="flex leading-[108%] flex-col items-center">
                    <p className="font-normal text-foreground text-sm">{following}</p>
                    <p className="text-[10px] font-bold text-muted-foreground leading-[133%]">Following</p>
                </div>
            </div>
            <Link href={`https://efp.app/${ens}`} target="_blank">
                <Button variant={"secondary"} size={"sm"}>Follow</Button>
            </Link>
        </div>
    )
}
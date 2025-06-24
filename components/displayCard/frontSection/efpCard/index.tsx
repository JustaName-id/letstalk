import { Button } from "@/components/ui/button";
import { EFPIcon } from "@/lib/icons";
import { useStats } from "@justweb3/efp-plugin";
import Link from "next/link";
import { useMemo } from "react";
export interface EfpCardProps {
    ens: string;
    display?: boolean;
}

export const EfpCard = ({ ens, display }: EfpCardProps) => {

    const { stats, isStatsLoading } = useStats({
        addressOrEns: ens,
    });

    const followers = useMemo(() => {
        if (isStatsLoading) return 0;
        return parseInt(stats?.followers_count ?? "0");
    }, [isStatsLoading, stats?.followers_count]);

    const following = useMemo(() => {
        if (isStatsLoading) return 0;
        return parseInt(stats?.following_count ?? "0");
    }, [isStatsLoading, stats?.following_count]);

    return (
        <div
            className={`flex flex-row items-center justify-between ${display ? "p-2" : "p-3"} gap-2 bg-sidebar-background rounded-[6px]`}
        >
            <div className="flex flex-row items-center gap-2">
                <div className="flex leading-[108%] flex-col items-center">
                    <p className="font-normal text-foreground text-sm">{followers}</p>
                    <p className="text-[10px] font-bold text-muted-foreground leading-[133%]">Followers</p>
                </div>
                <div className="min-w-[1px] min-h-[30px] flex flex-1 bg-border" />
                <div className="flex leading-[108%] flex-col items-center">
                    <p className="font-normal text-foreground text-sm">{following}</p>
                    <p className="text-[10px] font-bold text-muted-foreground leading-[133%]">Following</p>
                </div>
            </div>
            {!isStatsLoading && stats ? (
                <Link unselectable="on" href={`https://efp.app/${ens}`} target="_blank">
                    <Button variant={"secondary"} size={"sm"}>
                        <div className="flex flex-row gap-2 items-center">
                            <EFPIcon />
                            Follow
                        </div>
                    </Button>
                </Link>
            ) : (
                <Button disabled variant={"secondary"} size={"sm"}>
                    <div className="flex flex-row gap-2 items-center">
                        <EFPIcon />
                        Follow
                    </div>
                </Button>
            )}
        </div>
    )
}
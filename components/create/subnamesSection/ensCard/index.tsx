import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clientEnv } from "@/utils/config/clientEnv";
import { Records, useEnsAvatar } from "@justaname.id/react";
import Link from "next/link";

export interface EnsCardProps {
    records: Records;
    onEnsSelect: () => void;
}

export const EnsCard = ({ records, onEnsSelect }: EnsCardProps) => {
    const { avatar: ensAvatar } = useEnsAvatar({
        ens: records.ens,
        chainId: clientEnv.chainId
    })

    return (
        <Link href={`/${records.ens}`} onClick={onEnsSelect} className="flex flex-row p-2.5 gap-2.5 items-center rounded-[6px] border-[1px] border-border">
            <Avatar className="w-8 h-8 rounded-full">
                <AvatarImage className="rounded-full" src={ensAvatar} />
                <AvatarFallback>{records.ens.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <p className="text-foreground text-base font-normal leading-[150%]">{records.ens}</p>
        </Link>
    )
}
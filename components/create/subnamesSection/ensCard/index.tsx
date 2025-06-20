import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clientEnv } from "@/utils/config/clientEnv";
import { Records, useEnsAvatar } from "@justaname.id/react";

export interface EnsCardProps {
    records: Records;
    onEnsSelect: (ens: string) => void;
}

export const EnsCard = ({ records, onEnsSelect }: EnsCardProps) => {
    const { avatar: ensAvatar } = useEnsAvatar({
        ens: records.ens,
        chainId: clientEnv.chainId
    })

    return (
        <div onClick={() => onEnsSelect(records.ens)} className="flex flex-row p-2.5 gap-2.5 items-center rounded-[6px] border-[1px] border-border">
            <Avatar className="w-12 h-12 rounded-full">
                <AvatarImage className="rounded-full" src={ensAvatar} />
                <AvatarFallback>{records.ens.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <p className="text-foreground text-[18px] font-normal leading-[100%]">{records.ens}</p>
        </div>
    )
}
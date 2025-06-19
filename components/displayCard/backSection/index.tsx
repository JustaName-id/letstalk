import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CopyIcon } from "@/lib/icons";
import { clientEnv } from "@/utils/config/clientEnv";
import { useEnsAvatar } from "@justaname.id/react";
import { SanitizedRecords } from "@justaname.id/sdk";
import { useMemo } from "react";
import QRCode from "react-qr-code";

export interface BackSectionProps {
    subname: SanitizedRecords;
    ens: string;
    onFlip: () => void;
}

export const BackSection = ({ subname, ens, onFlip }: BackSectionProps) => {

    const qrCodeContent = useMemo(() => {
        return `${clientEnv.websiteUrl}/${ens}`
    }, [ens])


    const handleCopy = () => {
        navigator.clipboard.writeText(qrCodeContent);
    }

    const { avatar } = useEnsAvatar({
        ens: ens,
        chainId: clientEnv.chainId,
    })

    return (
        <div onClick={onFlip} className="flex flex-col gap-5 p-7 h-full justify-start">
            <QRCode style={{
                background: "transparent",
                borderRadius: "12px",
            }} value={qrCodeContent} className="w-full h-full bg-transparent" />
            <div className="flex flex-row py-2.5 gap-2.5 items-center">
                <Avatar className="w-16 h-16 rounded-full">
                    <AvatarImage className="w-16 h-16 rounded-full" src={avatar} />
                    <AvatarFallback>
                        {subname.display?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-foreground gap-1 ">
                    <p className="text-xl font-normal leading-[140%] ">{ens}</p>
                    <div className="flex flex-row gap-1 items-center ">
                        <p className="text-xs leading-[130%] font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[55%]">{subname.ethAddress.value}</p>
                        <CopyIcon onClick={handleCopy} className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div >
    )
}
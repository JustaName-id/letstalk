import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CopiedIcon, CopyIcon } from "@/lib/icons";
import { clientEnv } from "@/utils/config/clientEnv";
import { useEnsAvatar } from "@justaname.id/react";
import { SanitizedRecords } from "@justaname.id/sdk";
import { useMemo, useState } from "react";
import QRCode from "react-qr-code";

export interface BackSectionProps {
    subname: SanitizedRecords;
    ens: string;
    onFlip: () => void;
    display?: boolean;

}

export const BackSection = ({ subname, ens, onFlip, display }: BackSectionProps) => {

    const [copied, setCopied] = useState(false);
    const header = useMemo(() => {
        return subname.header ?? subname.banner
    }, [subname])

    const qrCodeContent = useMemo(() => {
        return `${clientEnv.websiteUrl}/${ens}`
    }, [ens])


    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(subname.ethAddress.value);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    const { avatar } = useEnsAvatar({
        ens: ens,
        chainId: clientEnv.chainId,
    })

    return (
        <div style={{
            backgroundImage: header
                ? `linear-gradient(180deg, rgba(255, 255, 255, 0.10) 0%, #FFF 30.74%), url(${header})`
                : "none",
            backgroundSize: header ? "100% 100%, 115%" : "auto",
            backgroundPosition: header ? "center, center top" : "center",
            backgroundRepeat: header ? "no-repeat, no-repeat" : "no-repeat",
            backgroundColor: "#FFF",
        }} onClick={onFlip} className={`flex flex-col relative h-full justify-start border-[3px] border-[#E4E4E7]  rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.10),_0px_10px_10px_-5px_rgba(0,0,0,0.04)] ${display ? "p-3 gap-2" : "p-6 gap-5"}`}>
            <div className="absolute inset-0 z-[1] bg-gradient-to-t h-[60px] top-[80px] from-white from-[40%] to-transparent" />
            <QRCode style={{
                background: "transparent",
                borderRadius: "12px",
            }} value={qrCodeContent} className="w-full z-[2] h-full bg-transparent scale-90" />
            <div className="flex flex-row py-2.5 gap-2.5 items-center">
                <Avatar className="w-16 h-16 rounded-full">
                    <AvatarImage className="w-16 h-16 rounded-full" src={avatar} />
                    <AvatarFallback>
                        {subname.display?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-foreground gap-1 overflow-x-hidden max-w-[70%]">
                    <p className="text-xl font-normal leading-[140%] ">{ens}</p>
                    <div className="flex flex-row gap-1 items-center">
                        <p className="text-xs leading-[130%] font-bold text-ellipsis overflow-hidden whitespace-nowrap w-full">{subname.ethAddress.value}</p>
                        {copied ? <CopiedIcon className="w-4 h-4" /> : <CopyIcon onClick={handleCopy} className="w-4 h-4" />}
                    </div>
                </div>
            </div>
        </div >
    )
}
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { clientEnv } from "@/utils/config/clientEnv";
import { useEnsAvatar } from "@justaname.id/react";
import { SanitizedRecords } from "@justaname.id/sdk";
import React, { useMemo } from "react";
import { EfpCard } from "./efpCard";
import { SocialCard } from "./socialCard";

export interface FrontSectionProps {
    subname: SanitizedRecords;
    onFlip: () => void;
    ens: string;
}

export const FrontSection = ({ subname, onFlip, ens }: FrontSectionProps) => {

    const displayText = !subname.display ? ens : subname.display;

    const header = useMemo(() => {
        return subname.header ?? subname.banner
    }, [subname])

    const { avatar, isLoading } = useEnsAvatar({
        ens: ens,
        chainId: clientEnv.chainId
    })

    const website = useMemo(() => {
        return subname.url
    }, [subname])

    const github = useMemo(() => {
        return subname.socials.find((social) => social.name === "Github")?.value
    }, [subname])

    const discord = useMemo(() => {
        return subname.socials.find((social) => social.name === "Discord")?.value
    }, [subname])

    const x = useMemo(() => {
        return subname.socials.find((social) => social.name === "X")?.value || subname.socials.find((social) => social.name === "Twitter")?.value
    }, [subname])

    const telegram = useMemo(() => {
        return subname.socials.find((social) => social.name === "Telegram")?.value
    }, [subname])

    return (
        <div onClick={onFlip} className={`flex bg-white relative flex-col h-full flex-1 border-[3px] border-[#E4E4E7]  rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.10),_0px_10px_10px_-5px_rgba(0,0,0,0.04)] p-4 gap-3 justify-between`} >
            <div style={{
                backgroundImage: `linear-gradient(180deg, transparent 0%, #FFF 100%), url(${header || "/banner/fallback.png"})`,
                backgroundSize: "100% 100%, 100%",
                backgroundPosition: "center top",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#FFF",
            }} className="h-[80px] absolute rounded-t-[9px] top-0 left-0 w-full" />
            <div className={`flex flex-col gap-3 z-[2]`}>
                <div className="flex flex-row w-full items-center gap-2.5">
                    <Avatar className="w-16 h-16 rounded-full flex-shrink-0">
                        <AvatarImage className="w-16 h-16 rounded-full" src={isLoading ? undefined : !avatar ? "/avatar/fallback.webp" : avatar} />
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <p
                            className={`font-normal flex-1 ${!!displayText ? 'leading-none' : 'leading-[130%]'}`}
                            style={{
                                fontSize: `${!!displayText ? displayText.length > 18 ? 16 : 25 : ens.length > 18 ? 16 : 25}px`,
                            }}
                        >
                            {displayText}
                        </p>
                        {!!subname.display && <p className={"text-xs font-bold text-muted-foreground leading-[90%]"}>{ens}</p>}

                    </div>
                </div>
                <p className={`font-normal text-muted-foreground leading-[133%] line-clamp-3 text-xs`}>{subname.description}</p>
            </div>
            <EfpCard ens={subname.ethAddress.value || ens} />
            <div className={`grid grid-cols-2 gap-2.5 gap-y-2.5`}>
                <SocialCard name="Website" value={website} horizontal className="col-span-2" />
                <SocialCard name="Telegram" value={telegram} className="col-span-1" />
                <SocialCard name="X/Twitter" value={x} className="col-span-1" />
                <SocialCard name="Github" value={github} className="col-span-1" />
                <SocialCard name="Discord" value={discord} className="col-span-1" />
            </div>
        </div >
    )
}
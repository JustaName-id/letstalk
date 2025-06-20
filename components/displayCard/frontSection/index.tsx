import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clientEnv } from "@/utils/config/clientEnv";
import { useEnsAvatar } from "@justaname.id/react";
import { SanitizedRecords } from "@justaname.id/sdk";
import { useMemo, useRef } from "react";
import { SocialCard } from "./socialCard";

export interface FrontSectionProps {
    subname: SanitizedRecords;
    onFlip: () => void;
    ens: string;
    display?: boolean;
}

export const FrontSection = ({ subname, onFlip, ens, display }: FrontSectionProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const displayText = subname.display ?? ens;

    const header = useMemo(() => {
        return subname.header ?? subname.banner
    }, [subname])

    const { avatar } = useEnsAvatar({
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
        <div style={{

        }} onClick={onFlip} className={`flex bg-white relative flex-col h-full flex-1 border-[3px] border-[#E4E4E7]  rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.10),_0px_10px_10px_-5px_rgba(0,0,0,0.04)] ${display ? "p-3 gap-2" : "p-6 gap-5"}`} >
            <div style={{
                backgroundImage: header
                    ? `linear-gradient(180deg, transparent 0%, #FFF 100%), url(${header})`
                    : "none",
                backgroundSize: header ? "100% 100%, 100%" : "auto",
                backgroundPosition: header ? "center top" : "center",
                backgroundRepeat: header ? "no-repeat" : "no-repeat",
                backgroundColor: "#FFF",
            }} className="h-[80px] absolute rounded-t-[12px] top-0 left-0 w-full" />
            {/* <div className="absolute inset-0 z-[1] bg-gradient-to-t h-[60px] top-[80px] from-white from-[40%] to-transparent" /> */}
            <div className={`flex flex-col ${display ? "gap-2" : "gap-5"} z-[2]`}>
                <div ref={containerRef} className="flex flex-row w-full items-center gap-2.5">
                    <Avatar className="w-16 h-16 rounded-full flex-shrink-0">
                        <AvatarImage className="w-16 h-16 rounded-full" src={avatar} />
                        <AvatarFallback>
                            {subname.display?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <p
                            className={`font-normal flex-1 ${!!displayText ? 'leading-none' : 'leading-[130%]'}`}
                            style={{
                                fontSize: `${!!displayText ? displayText.length > 18 ? 16 : 25 : ens.length > 18 ? 16 : 25}px`,
                            }}
                        >
                            {displayText ?? ens}
                        </p>
                        {!!displayText && <p className="text-xs font-bold text-muted-foreground leading-[90%]">{ens}</p>}

                    </div>
                </div>
                <p className="text-xs font-normal text-muted-foreground leading-[133%]">{subname.description}</p>
            </div>
            <div className={`grid grid-cols-2 ${display ? "gap-1.5 gap-y-1.5" : "gap-2.5 gap-y-2.5"}`}>
                {website && <SocialCard display={display} name="Website" value={website} horizontal className="col-span-2" />}
                {telegram && <SocialCard display={display} name="Telegram" value={telegram} className="col-span-1" />}
                {x && <SocialCard display={display} name="X/Twitter" value={x} className="col-span-1" />}
                {github && <SocialCard display={display} name="Github" value={github} className="col-span-1" />}
                {discord && <SocialCard display={display} name="Discord" value={discord} className="col-span-1" />}
            </div>
        </div >
    )
}
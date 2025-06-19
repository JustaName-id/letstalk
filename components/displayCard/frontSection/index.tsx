import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clientEnv } from "@/utils/config/clientEnv";
import { useEnsAvatar } from "@justaname.id/react";
import { SanitizedRecords } from "@justaname.id/sdk";
import { useMemo } from "react";
import { SocialCard } from "./socialCard";

export interface FrontSectionProps {
    subname: SanitizedRecords;
    onFlip: () => void;
    ens: string;
}

export const FrontSection = ({ subname, onFlip, ens }: FrontSectionProps) => {

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
        <div onClick={onFlip} className="flex flex-col gap-5 p-7 h-full flex-1" >
            <div className={`flex flex-col gap-5 h-full`}>
                <div className="flex flex-row py-2.5 w-full items-center gap-2.5">
                    <Avatar className="w-16 h-16 rounded-full">
                        <AvatarImage className="w-16 h-16 rounded-full" src={avatar} />
                        <AvatarFallback>
                            {subname.display?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 leading-[100%] text-foreground">
                        <p className="text-[30px] font-semibold">{subname.display ?? ens}</p>
                        {/* <p className="text-[14px] font-bold">{}</p> */}
                    </div>
                </div>
                <p className="text-xs font-normal text-muted-foreground leading-[133%]">{subname.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 gap-y-2.5">
                {website && <SocialCard name="Website" value={website} horizontal className="col-span-2" />}
                {github && <SocialCard name="Github" value={github} className="col-span-1" />}
                {discord && <SocialCard name="Discord" value={discord} className="col-span-1" />}
                {x && <SocialCard name="X/Twitter" value={x} className="col-span-1" />}
                {telegram && <SocialCard name="Telegram" value={telegram} className="col-span-1" />}
            </div>
        </div>
    )
}
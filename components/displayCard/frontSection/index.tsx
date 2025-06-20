import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clientEnv } from "@/utils/config/clientEnv";
import { useEnsAvatar } from "@justaname.id/react";
import { SanitizedRecords } from "@justaname.id/sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import { SocialCard } from "./socialCard";

export interface FrontSectionProps {
    subname: SanitizedRecords;
    onFlip: () => void;
    ens: string;
}

export const FrontSection = ({ subname, onFlip, ens }: FrontSectionProps) => {
    const textRef = useRef<HTMLParagraphElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState(30);
    const [isMultiLine, setIsMultiLine] = useState(false);

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

    useEffect(() => {
        if (!textRef.current || !containerRef.current) return;

        const adjustTextSize = () => {
            const textElement = textRef.current!;
            const containerElement = containerRef.current!;

            const availableWidth = containerElement.offsetWidth - 74 - 20;

            if (displayText.length > 25) {
                setIsMultiLine(true);
                let currentSize = 24;
                textElement.style.fontSize = `${currentSize}px`;

                while (textElement.scrollHeight > textElement.offsetHeight && currentSize > 16) {
                    currentSize -= 1;
                    textElement.style.fontSize = `${currentSize}px`;
                }
                setFontSize(currentSize);
                return;
            }

            setIsMultiLine(false);

            let currentSize = 30;
            textElement.style.fontSize = `${currentSize}px`;
            textElement.style.whiteSpace = 'nowrap';

            while (textElement.scrollWidth > availableWidth && currentSize > 16) {
                currentSize -= 1;
                textElement.style.fontSize = `${currentSize}px`;
            }

            setFontSize(currentSize);
        };

        adjustTextSize();

        const resizeObserver = new ResizeObserver(adjustTextSize);
        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [displayText]);

    return (
        <div style={{
            backgroundImage: header
                ? `linear-gradient(180deg, rgba(255, 255, 255, 0.10) 0%, #FFF 30.74%), url(${header})`
                : "none",
            backgroundSize: header ? "100% 100%, 115%" : "auto",
            backgroundPosition: header ? "center, center top" : "center",
            backgroundRepeat: header ? "no-repeat, no-repeat" : "no-repeat",
            backgroundColor: "#FFF",
        }} onClick={onFlip} className="flex relative flex-col gap-5 p-7 h-full flex-1 border-[3px] border-[#E4E4E7]  rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.10),_0px_10px_10px_-5px_rgba(0,0,0,0.04)]" >
            <div className="absolute inset-0 z-[1] bg-gradient-to-t h-[60px] top-[75px] from-white to-transparent" />
            <div className={`flex flex-col gap-5 z-[2]`}>
                <div ref={containerRef} className="flex flex-row py-2.5 w-full items-center gap-2.5">
                    <Avatar className="w-16 h-16 rounded-full flex-shrink-0">
                        <AvatarImage className="w-16 h-16 rounded-full" src={avatar} />
                        <AvatarFallback>
                            {subname.display?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <p
                        ref={textRef}
                        className={`font-semibold flex-1 ${isMultiLine ? 'leading-tight' : 'leading-none'}`}
                        style={{
                            fontSize: `${fontSize}px`,
                            whiteSpace: isMultiLine ? 'normal' : 'nowrap',
                            wordBreak: isMultiLine ? 'break-word' : 'normal',
                            lineHeight: isMultiLine ? '1.2' : '1'
                        }}
                    >
                        {displayText}
                    </p>
                </div>
                <p className="text-xs font-normal text-muted-foreground leading-[133%]">{subname.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 gap-y-2.5">
                {website && <SocialCard name="Website" value={website} horizontal className="col-span-2" />}
                {telegram && <SocialCard name="Telegram" value={telegram} className="col-span-1" />}
                {x && <SocialCard name="X/Twitter" value={x} className="col-span-1" />}
                {github && <SocialCard name="Github" value={github} className="col-span-1" />}
                {discord && <SocialCard name="Discord" value={discord} className="col-span-1" />}
            </div>
        </div>
    )
}
import { SanitizedRecords } from "@justaname.id/sdk";
import { useMemo, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { BackSection } from "./backSection";
import { FrontSection } from "./frontSection";

export interface DisplayCardProps {
    subname: SanitizedRecords;
    ens: string;
}

export const DisplayCard = ({ subname, ens }: DisplayCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const header = useMemo(() => {
        return subname.header ?? subname.banner
    }, [subname])

    return (
        <div className="flex flex-col gap-5 items-center w-full">
            <div style={{
                background: header
                    ? `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 25%, rgba(255,255,255,1) 35%), url(${header})`
                    : "none",
                backgroundSize: header ? "cover, cover" : "auto",
                backgroundPosition: header ? "center, center top" : "center",
                backgroundRepeat: header ? "no-repeat, no-repeat" : "no-repeat",
            }} className={`w-full border-[3px] border-[#E4E4E7] min-h-[520px] rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.10),_0px_10px_10px_-5px_rgba(0,0,0,0.04)]`}>
                <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" containerClassName="min-h-[520px]" cardStyles={{
                    front: {
                        height: "520px"
                    },
                    back: {
                        height: "520px"
                    }
                }} >
                    <FrontSection subname={subname} onFlip={() => setIsFlipped(!isFlipped)} ens={ens} />
                    <BackSection subname={subname} ens={ens} onFlip={() => setIsFlipped(!isFlipped)} />
                </ReactCardFlip>
            </div>
            <p className="text-base text-gray-500 from-gradient-1-start bg-clip-text">Click to flip Card</p>
        </div>
    );
};
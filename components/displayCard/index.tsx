import { SanitizedRecords } from "@justaname.id/sdk";
import { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { BackSection } from "./backSection";
import { FrontSection } from "./frontSection";

export interface DisplayCardProps {
    subname: SanitizedRecords;
    ens: string;
}

export const DisplayCard = ({ subname, ens }: DisplayCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="flex flex-col gap-5 items-center w-full">
            <div className={`w-full min-h-[520px]  relative `}>
                <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" containerClassName="min-h-[520px] relative !z-[2]" cardStyles={{
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
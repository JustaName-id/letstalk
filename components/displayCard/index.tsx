import { SanitizedRecords } from "@justaname.id/sdk";
import { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { BackSection } from "./backSection";
import { FrontSection } from "./frontSection";

export interface DisplayCardProps {
    subname: SanitizedRecords;
    ens: string;
    isCardFlipped?: boolean;
}

export const DisplayCard = ({ subname, ens, isCardFlipped }: DisplayCardProps) => {
    const [isFlipped, setIsFlipped] = useState(isCardFlipped ?? false);

    useEffect(() => {
        setIsFlipped(isCardFlipped ?? false);
    }, [isCardFlipped])

    return (
        <div className="flex flex-col px-[5%] gap-5 items-center w-full overflow-hidden">
            <div className={`w-full min-h-[480px] relative overflow-hidden`}>
                <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" containerClassName="min-h-[480px] relative !z-[2]" cardStyles={{
                    front: {
                        height: "480px"
                    },
                    back: {
                        height: "480px"
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
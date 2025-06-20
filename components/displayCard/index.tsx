import { SanitizedRecords } from "@justaname.id/sdk";
import { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { BackSection } from "./backSection";
import { FrontSection } from "./frontSection";

export interface DisplayCardProps {
    subname: SanitizedRecords;
    ens: string;
    isCardFlipped?: boolean;
    display?: boolean;
}

export const DisplayCard = ({ subname, ens, isCardFlipped, display }: DisplayCardProps) => {
    const [isFlipped, setIsFlipped] = useState(isCardFlipped ?? false);

    useEffect(() => {
        setIsFlipped(isCardFlipped ?? false);
    }, [isCardFlipped])

    return (
        <div className="flex flex-col px-[5%] gap-5 items-center w-full overflow-hidden justify-start relative">
            <div className={`w-full ${display ? "min-h-[400px]" : "min-h-[480px]"} py-[40px] relative overflow-hidden`}>
                <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" containerClassName={`${display ? "min-h-[400px]" : "min-h-[480px]"} relative !z-[2]`} cardStyles={{
                    front: {
                        height: display ? "400px" : "480px"
                    },
                    back: {
                        height: display ? "400px" : "480px"
                    }
                }} >
                    <FrontSection display={display} subname={subname} onFlip={() => setIsFlipped(!isFlipped)} ens={ens} />
                    <BackSection display={display} subname={subname} ens={ens} onFlip={() => setIsFlipped(!isFlipped)} />
                </ReactCardFlip>
            </div>
        </div>
    );
};
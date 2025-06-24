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
        <div className={`flex flex-col px-[5%] gap-5 items-center w-full overflow-hidden justify-start relative`}>
            <div className={`w-full min-h-[490px] py-[40px] relative overflow-hidden`}>
                <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" containerClassName={`min-h-[490px] relative !z-[2]`} cardStyles={{
                    front: {
                        height: "490px"
                    },
                    back: {
                        height: "490px"
                    }
                }} >
                    <FrontSection subname={subname} onFlip={() => setIsFlipped(!isFlipped)} ens={ens} />
                    <BackSection subname={subname} ens={ens} onFlip={() => setIsFlipped(!isFlipped)} />
                </ReactCardFlip>
            </div>
        </div>
    );
};
import { SanitizedRecords } from "@justaname.id/sdk";
import { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { BackSection } from "./backSection";
import { FrontSection } from "./frontSection";

export interface DisplayCardProps {
    subname: SanitizedRecords;
    ens: string;
    isCardFlipped?: boolean;
    hasUserFlipped?: boolean;
}

export const DisplayCard = ({ subname, ens, isCardFlipped, hasUserFlipped }: DisplayCardProps) => {
    const [isFlipped, setIsFlipped] = useState(isCardFlipped ?? false);
    const [showFlipHint, setShowFlipHint] = useState(false);

    useEffect(() => {
        setIsFlipped(isCardFlipped ?? false);
    }, [isCardFlipped]);

    useEffect(() => {
        if (hasUserFlipped) return;

        const showHintCycle = () => {
            setShowFlipHint(true);

            setTimeout(() => {
                setShowFlipHint(false);
            }, 2000);
        };

        const initialTimer = setTimeout(() => {
            showHintCycle();

            const interval = setInterval(() => {
                if (hasUserFlipped) {
                    clearInterval(interval);
                    return;
                }
                showHintCycle();
            }, 2500);

            return () => clearInterval(interval);
        }, 3000);

        return () => clearTimeout(initialTimer);
    }, [hasUserFlipped]);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        setShowFlipHint(false);
    };


    return (
        <div className={`flex flex-col px-[5%] gap-5 items-center w-full overflow-hidden justify-start relative`}>
            <div className={`w-full min-h-[490px] py-[40px] relative overflow-hidden`}>
                <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" containerClassName={`min-h-[490px] relative !z-[2] ${showFlipHint && !hasUserFlipped ? 'animate-[flipHint_2s_ease-in-out]' : ''}`} cardStyles={{
                    front: {
                        height: "490px"
                    },
                    back: {
                        height: "490px"
                    }
                }} >
                    <FrontSection subname={subname} onFlip={handleFlip} ens={ens} />
                    <BackSection subname={subname} ens={ens} onFlip={handleFlip} />
                </ReactCardFlip>
            </div>
        </div>
    );
};
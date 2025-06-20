import { clientEnv } from "@/utils/config/clientEnv";
import { useRecords } from "@justaname.id/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { DisplaySection } from "../../displaySection";
import { Button } from "../../ui/button";

export const PreviewSection = () => {
    const { openConnectModal } = useConnectModal();

    const { records } = useRecords({
        ens: "nick.eth",
        chainId: clientEnv.chainId
    })

    return (
        <div className="flex flex-col overflow-hidden relative h-full justify-between w-full gap-5">
            <div className="flex flex-col gap-2.5">
                <h1 className="text-foreground text-[30px] font-normal leading-[100%]">Create your ENS based Business card</h1>
                <p className="text-xs text-muted-foreground font-normal leading-[133%]">Lorem ipsum dolor sit amet consectetur. Aliquet vivamus ligula elementum lorem penatibus pretium.</p>
            </div>
            <div className="flex flex-col w-full overflow-hidden">
                <div className="transform h-full scale-75 flex origin-top rounded-[12px] border-[3px] p-4 border-[#E4E4E7] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.10),_0px_10px_10px_-5px_rgba(0,0,0,0.04)] overflow-hidden">
                    {records && (
                        <DisplaySection ens={"nick.eth"} className="gap-4" records={records?.sanitizedRecords} />
                    )}
                </div>
            </div>
            <Button className="absolute bottom-8 left-1/2 -translate-x-1/2" variant={"default"} onClick={() => openConnectModal?.()}>Connect Wallet</Button>
        </div>
    )
}
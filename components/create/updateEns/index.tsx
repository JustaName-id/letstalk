import { useAccountEnsNames, useAccountSubnames, useUpdateSubname, useUploadMedia } from "@justaname.id/react";
import { useMemo } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useAccount, useDisconnect } from "wagmi";
import { clientEnv } from "@/utils/config/clientEnv";

export const UpdateEnsSection = () => {
    const { disconnect } = useDisconnect();
    const { address } = useAccount();
    const { updateSubname, isUpdateSubnamePending } = useUpdateSubname({
        chainId: clientEnv.chainId,
    })

    const handleUpdateSubname = (subname: string) => {
        // updateSubname({
        //     subname,
        // })
    }

    return (
        <div className="flex flex-col h-full gap-5">
            <div className="flex flex-row gap-2.5 justify-between w-full items-center">


            </div>
            <Input placeholder="Enter a subname" className="w-full" rightText="cardeth.eth" containerClassName="w-full" />
        </div>
    )
}
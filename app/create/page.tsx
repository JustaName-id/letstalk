"use client"

import { PreviewSection } from "@/components/create/previewSection";
import { SubnamesSection } from "@/components/create/subnamesSection";
import { UpdateEnsSection } from "@/components/create/updateEns";
import { clientEnv } from "@/utils/config/clientEnv";
import { useRecords } from "@justaname.id/react";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function Home() {
    const { isConnected } = useAccount();
    const [newSubname, setNewSubname] = useState("");
    const [ens, setEns] = useState("");

    const { records } = useRecords({
        enabled: !!ens,
        chainId: clientEnv.chainId,
        ens: ens,
    })

    const onSubnameClaim = (subname: string) => {
        setNewSubname(subname);
    }

    const onEnsSelect = (ens: string) => {
        setEns(ens);
    }

    return (
        !isConnected ?
            <PreviewSection />
            :
            !newSubname && !ens ?
                <SubnamesSection onEnsSelect={onEnsSelect} onSubnameClaim={onSubnameClaim} />
                :
                <UpdateEnsSection subname={!!newSubname ? newSubname : ens} initialRecords={records?.sanitizedRecords} />
    );
}

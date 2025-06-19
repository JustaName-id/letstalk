"use client"

import { PreviewSection } from "@/components/create/previewSection";
import { SubnamesSection } from "@/components/create/subnamesSection";
import { UpdateEnsSection } from "@/components/create/updateEns";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function Home() {
    const { isConnected } = useAccount();
    const [newSubname, setNewSubname] = useState("");

    const onSubnameClaim = (subname: string) => {
        setNewSubname(subname);
    }

    return (
        !isConnected ?
            <PreviewSection />
            :
            !newSubname ?
                <SubnamesSection onSubnameClaim={onSubnameClaim} />
                :
                <UpdateEnsSection subname={newSubname} />
    );
}

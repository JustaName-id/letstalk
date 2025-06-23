import { clientEnv } from "@/utils/config/clientEnv";
import { useAccountEnsNames, useAccountSubnames, useAddSubname, useIsSubnameAvailable } from "@justaname.id/react";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { EnsCard } from "./ensCard";

export interface SubnamesSectionProps {
    onSubnameClaim: (subname: string) => void;
    onEnsSelect: (ens: string) => void;
}

export const SubnamesSection = ({ onSubnameClaim, onEnsSelect }: SubnamesSectionProps) => {
    const { disconnect } = useDisconnect();
    const { address } = useAccount();
    const [username, setUsername] = useState("");
    const [debouncedUsername, setDebouncedUsername] = useState(username);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedUsername(username);
        }, 500);
        return () => clearTimeout(timeout);
    }, [username]);
    const { accountSubnames, isAccountSubnamesPending } = useAccountSubnames({
        enabled: !!address
    });
    const { accountEnsNames, isAccountEnsNamesPending } = useAccountEnsNames({
        enabled: !!address
    });
    const { isSubnameAvailable, isSubnameAvailablePending } = useIsSubnameAvailable({
        username: debouncedUsername,
        chainId: clientEnv.chainId,
        ensDomain: clientEnv.justaNameEns,
        enabled: !!debouncedUsername && debouncedUsername.length > 2,
    });
    const { addSubname, isAddSubnamePending } = useAddSubname({
        backendUrl: clientEnv.websiteUrl,
    });

    const allSubnames = useMemo(() => {
        if (isAccountSubnamesPending || isAccountEnsNamesPending) {
            return []
        }
        const combined = [...accountSubnames, ...accountEnsNames];
        const uniqueSubnames = combined.filter((subname, index, array) =>
            array.findIndex(item => item.ens === subname.ens) === index
        );
        return uniqueSubnames;
    }, [accountSubnames, accountEnsNames, isAccountSubnamesPending, isAccountEnsNamesPending])



    const handleClaim = () => {
        if (isAddSubnamePending) return;
        addSubname({
            username: debouncedUsername,
            chainId: clientEnv.chainId,
            ensDomain: clientEnv.justaNameEns,
        }, {
            onSuccess: () => {
                onSubnameClaim(`${debouncedUsername}.${clientEnv.justaNameEns}`);
                setUsername("");
            }
        });
    }

    return (
        <div className="flex flex-1 flex-col p-5 h-full w-full gap-8">
            <h1 className="text-foreground text-[30px] font-normal leading-[100%]">Choose an ENS or Claim a Free cardEth Name!</h1>
            <div className="flex flex-col h-full  justify-between">
                <div className="flex flex-col gap-3 w-full">
                    <p className="text-foreground text-xl font-normal leading-[100%]">{`Your Wallet's ENSs`}</p>
                    <div className="flex flex-col gap-2.5 max-h-[48vh] overflow-y-auto w-full">
                        {allSubnames.map((subname) => (
                            <EnsCard key={subname.ens} records={subname} onEnsSelect={onEnsSelect} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <p className="text-foreground text-xl font-semibold leading-[100%]">Claim a Subname</p>
                    <div className="flex flex-row gap-2 justify-between">
                        <Input placeholder="Enter a subname" disabled={isAddSubnamePending} className="w-full" rightText={`.${clientEnv.justaNameEns}`} containerClassName="w-full" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <Button variant={"default"} disabled={isSubnameAvailablePending || !isSubnameAvailable?.isAvailable || isAddSubnamePending} onClick={handleClaim}>{isAddSubnamePending ? "Claiming..." : "Claim"}</Button>
                    </div>
                    <p className="text-xs text-muted-foreground font-normal leading-[133%]">Claim your free "letstalk.eth" subname, add your socials, and start networking!</p>
                </div>
                <div className="flex flex-row gap-[15px] justify-between items-center w-full">
                    <Button variant={"secondary"} onClick={() => disconnect()}>Disconnect</Button>
                    <p className="text-border text-xs font-bold leading-[133%] text-ellipsis overflow-hidden whitespace-nowrap">{address}</p>
                </div>
            </div>
        </div>
    )
}
import { useAccountEnsNames, useAccountSubnames } from "@justaname.id/react";
import { useMemo } from "react";
import { EnsCard } from "./ensCard";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useAccount, useDisconnect } from "wagmi";

export interface SubnamesSectionProps {
    onSubnameClaim: (subname: string) => void;
}

export const SubnamesSection = ({ onSubnameClaim }: SubnamesSectionProps) => {
    const { disconnect } = useDisconnect();
    const { address } = useAccount();
    const { accountSubnames, isAccountSubnamesPending } = useAccountSubnames({
        enabled: !!address
    });
    const { accountEnsNames, isAccountEnsNamesPending } = useAccountEnsNames({
        enabled: !!address
    });

    const allSubnames = useMemo(() => {
        if (isAccountSubnamesPending || isAccountEnsNamesPending) {
            return []
        }
        return [...accountSubnames, ...accountEnsNames]
    }, [accountSubnames, accountEnsNames])
    return (
        <div className="flex flex-col w-full gap-8">
            <div className="flex flex-col gap-2.5">
                <h1 className="text-foreground text-[30px] font-normal leading-[100%]">Choose an ENS or Claim a Free cardEth Name!</h1>
                <p className="text-xs text-muted-foreground font-normal leading-[133%]">Lorem ipsum dolor sit amet consectetur. Aliquet vivamus ligula elementum lorem penatibus pretium.</p>
            </div>
            <div className="flex flex-col h-full  justify-between">
                <div className="flex flex-col gap-3 w-full">
                    <p className="text-foreground text-xl font-normal leading-[100%]">Your Wallet's ENSs</p>
                    <div className="flex flex-col gap-2.5 max-h-[48vh] overflow-y-auto w-full">
                        {allSubnames.map((subname) => (
                            <EnsCard key={subname.ens} records={subname} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <p className="text-foreground text-xl font-normal leading-[100%]">Claim a Subname</p>
                    <div className="flex flex-row gap-2 justify-between">
                        <Input placeholder="Enter a subname" className="w-full" rightText="cardeth.eth" containerClassName="w-full" />
                        <Button variant={"default"}>Claim</Button>
                    </div>
                    <p className="text-xs text-muted-foreground font-normal leading-[133%]">Lorem ipsum dolor sit amet consectetur. Aliquet vivamus ligula elementum lorem penatibus pretium.</p>

                </div>
                <div className="flex flex-row gap-[15px] justify-between items-center w-full">
                    <Button variant={"secondary"} onClick={() => disconnect()}>Disconnect</Button>
                    <p className="text-border text-xs font-bold leading-[133%] text-ellipsis overflow-hidden whitespace-nowrap">{address}</p>
                </div>
            </div>
        </div>
    )
}
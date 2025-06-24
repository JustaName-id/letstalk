import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { clientEnv } from "@/utils/config/clientEnv";
import { useAccountEnsNames, useAccountSubnames, useAddSubname, useIsSubnameAvailable } from "@justaname.id/react";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { EnsCard } from "./ensCard";

export interface SubnamesSectionProps {
    onEnsSelect: (ens: string) => void;
    onEnsDrawerOpen: (open: boolean) => void;
    ensDrawerOpen: boolean;
}

export const SubnamesSection = ({ onEnsSelect, onEnsDrawerOpen, ensDrawerOpen }: SubnamesSectionProps) => {
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
                onEnsSelect(`${debouncedUsername}.${clientEnv.justaNameEns}`);
                setUsername("");
            }
        });
    }

    const onDisconnect = () => {
        onEnsDrawerOpen(false);
        disconnect();
    }

    return (
        <Drawer open={ensDrawerOpen} onOpenChange={onEnsDrawerOpen}>
            <DrawerContent aria-describedby={undefined} >
                <div className="hidden">
                    <DrawerTitle></DrawerTitle>
                </div>
                <div className="flex flex-1 flex-col p-5 h-full w-full gap-6">
                    <h1 style={{
                        lineHeight: "110%"
                    }} className="text-foreground text-[30px] font-normal">Choose an existing ENS name to edit, or claim a free letstalk.eth subname!</h1>
                    <div className="flex flex-col h-full gap-3 justify-between">
                        <div className="flex flex-col gap-4">
                            <p className="text-foreground text-xl font-normal leading-[100%]">Claim a Subname</p>
                            <div className="flex flex-col gap-1 w-full transition-all duration-500 ease-in-out">
                                <div className="flex flex-row gap-2 justify-between">
                                    <Input placeholder="Enter a subname" disabled={isAddSubnamePending} className="w-full" rightText={`.${clientEnv.justaNameEns}`} containerClassName="w-full" value={username} onChange={(e) => setUsername(e.target.value)} />
                                    <Button variant={"default"} disabled={isSubnameAvailablePending || !isSubnameAvailable?.isAvailable || isAddSubnamePending} onClick={handleClaim}>{isAddSubnamePending ? "Claiming..." : "Claim"}</Button>
                                </div>
                                {!isSubnameAvailable?.isAvailable && !isSubnameAvailablePending && (
                                    <p className="text-xs text-red-500 font-semibold leading-[133%]">Subname taken</p>
                                )}
                                <p className="text-xs text-muted-foreground font-semibold leading-[133%]">Powered by justaname.id</p>
                            </div>
                        </div>
                        <div className="flex flex-row w-full items-center gap-2 justify-between">
                            <div className="w-full flex-1 h-[1px] bg-border" />
                            <p className="text-muted-foreground text-xs font-normal leading-[100%]">Or</p>
                            <div className="w-full flex-1 h-[1px] bg-border" />

                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <p className="text-foreground text-xl font-normal leading-[100%]">{`Your Wallet's ENSs`}</p>
                            <div className="flex flex-col gap-2 max-h-[32vh] overflow-y-auto w-full">
                                {
                                    allSubnames.length > 0 ?
                                        allSubnames.map((subname) => (
                                            <EnsCard key={subname.ens} records={subname} onEnsSelect={onEnsSelect} />
                                        ))
                                        :
                                        <p style={{
                                            padding: "30px 0"
                                        }} className="text-xs text-muted-foreground text-center py-5 font-semibold leading-[133%]">No ENS names found</p>
                                }
                            </div>
                        </div>
                        <div className="flex flex-row gap-[15px] justify-between items-center w-full">
                            <Button variant={"secondary"} onClick={onDisconnect}>Disconnect</Button>
                            <p className="text-border text-xs font-bold leading-[133%] text-ellipsis overflow-hidden whitespace-nowrap">{address}</p>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
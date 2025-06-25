import { DrawerTitle } from "@/components/ui/drawer";
import { clientEnv } from "@/utils/config/clientEnv";
import { useAccountEnsNames, useAccountSubnames, useAddSubname, useIsSubnameAvailable } from "@justaname.id/react";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { EnsCard } from "./ensCard";
import {Dialog, DialogContent} from "@/components/ui/dialog";

export interface SubnamesSectionProps {
    onEnsSelect: (ens: { name: string, new: boolean }) => void;
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
        enabled: !!address,
    });
    const { isSubnameAvailable, isSubnameAvailablePending } = useIsSubnameAvailable({
        username: debouncedUsername,
        chainId: clientEnv.chainId,
        ensDomain: clientEnv.justaNameEns,
        enabled: !!debouncedUsername && debouncedUsername.length > 2,
    });
    const { addSubname, isAddSubnamePending } = useAddSubname();

    const allSubnames = useMemo(() => {
        if (isAccountSubnamesPending || isAccountEnsNamesPending) {
            return []
        }
        const combined = [];

        const letsTalkSubname = accountSubnames.filter(subname => subname.ens.endsWith(`${clientEnv.justaNameEns}`));
        if(letsTalkSubname) {
            combined.push(...letsTalkSubname);
        }
        const accountSubnamesWithoutLetsTalk = accountSubnames.filter(subname => !subname.ens.endsWith(`${clientEnv.justaNameEns}`));
        combined.push(...accountSubnamesWithoutLetsTalk);
        combined.push(...accountEnsNames);
        const uniqueSubnames = combined.filter((subname, index, array) =>
            array.findIndex(item => item.ens === subname.ens) === index
        );
        return uniqueSubnames;
    }, [accountSubnames, accountEnsNames, isAccountSubnamesPending, isAccountEnsNamesPending])

    const handleClaim = () => {
        if (isAddSubnamePending) return;
        addSubname({
            username: debouncedUsername.toLowerCase(),
            chainId: clientEnv.chainId,
            ensDomain: clientEnv.justaNameEns,
        }, {
            onSuccess: () => {
                onEnsSelect({ name: `${debouncedUsername.toLowerCase()}.${clientEnv.justaNameEns}`, new: true });
                setUsername("");
            }
        });
    }

    const onDisconnect = () => {
        onEnsDrawerOpen(false);
        disconnect();
    }

    return (
        <Dialog open={ensDrawerOpen} onOpenChange={onEnsDrawerOpen}>
            <DialogContent aria-describedby={undefined} >
                <div className="hidden">
                    <DrawerTitle></DrawerTitle>
                </div>
                <div className="flex flex-1 flex-col p-5 h-full w-full gap-5 justify-between">
                    <div>
                        <h1 style={{
                            lineHeight: "110%"
                        }} className="text-foreground text-[30px] font-normal">Choose your favorite ENS</h1>
                        <span> or claim a free letstalk.eth subname!</span>
                    </div>
                    <div className="flex flex-col h-full gap-3 justify-between">
                        <div className="flex flex-col gap-4">
                            <p className="text-foreground text-xl font-normal leading-[100%]">Claim a Subname</p>
                            <div className="flex flex-col gap-1 w-full transition-all duration-500 ease-in-out">
                                <div className="flex flex-row gap-2 justify-between">
                                    <Input placeholder="subname" disabled={isAddSubnamePending} className="w-full" rightText={`.${clientEnv.justaNameEns}`} containerClassName="w-full" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} />
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
                            <p className="text-foreground text-xl font-normal leading-[100%]">{`Your ENS names`}</p>
                            <div className="flex flex-col gap-2 max-h-[30dvh] overflow-y-auto w-full">
                                {
                                    allSubnames.length > 0 ?
                                        allSubnames.map((subname) => (
                                            <EnsCard key={subname.ens} records={subname} onEnsSelect={() => onEnsDrawerOpen(false)} />
                                        ))
                                        :
                                        <p style={{
                                            padding: "30px 0"
                                        }} className="text-xs text-muted-foreground text-center py-5 font-semibold leading-[133%]">No ENS names found</p>
                                }
                            </div>
                        </div>
                        <div className="flex flex-row gap-[15px] mt-auto justify-between items-center">
                            <Button variant={"secondary"} onClick={onDisconnect}>Disconnect</Button>
                            {/*<div className="flex flex-row gap-2 items-center">*/}
                                <span className="text-border text-xs font-bold text-ellipsis  whitespace-nowrap">{(address || "").slice(0,12)}...{(address || "").slice(32,44)}</span>
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
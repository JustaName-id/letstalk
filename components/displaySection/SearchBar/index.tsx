import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { handleNormalizeEns } from "@/lib/helpers"
import { SearchIcon } from "@/lib/icons"
import { useEnsIsRegistered } from "@/query/ens"
import { clientEnv } from "@/utils/config/clientEnv"
// import { useSearchSubnames } from "@justaname.id/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { SearchItem } from "./searchItem"
import { SearchSkeleton } from "./searchSkeleton"

interface SearchBarProps {
    onActiveChange: (value: boolean) => void;
    isSearchActive: boolean;
    onlyIcon?: boolean;
}

export const SearchBar = ({ onActiveChange, isSearchActive, onlyIcon }: SearchBarProps) => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchValue, setSearchValue] = useState("")
    const [debouncedValue] = useDebounceValue(searchValue, 150)

    const shouldFetchData = debouncedValue.length > 2;

    // const { subnames, isSubnamesLoading } = useSearchSubnames({
    //     name: debouncedValue,
    //     chainId: clientEnv.chainId,
    //     enabled: shouldFetchData,
    // });

    const router = useRouter()

    const {
        isRegistered: isEthRegistered,
        isIsRegisteredLoading: isEthLoading
    } = useEnsIsRegistered(
        handleNormalizeEns(debouncedValue, "eth"),
        { enabled: shouldFetchData }
    )

    const {
        isRegistered: isBoxRegistered,
        isIsRegisteredLoading: isBoxLoading
    } = useEnsIsRegistered(
        handleNormalizeEns(debouncedValue, "box"),
        { enabled: shouldFetchData }
    );

    const {
        isRegistered: isBaseRegistered,
        isIsRegisteredLoading: isBaseLoading
    } = useEnsIsRegistered(
        handleNormalizeEns(debouncedValue, "base.eth"),
        { enabled: shouldFetchData }
    );

    const {
        isRegistered: isLetsTalkRegistered,
        isIsRegisteredLoading: isLetsTalkLoading
    } = useEnsIsRegistered(
        handleNormalizeEns(debouncedValue, "letstalk.eth"),
        { enabled: shouldFetchData }
    );

    const manualDomains = useMemo(() => {
        const domains: { ens: string; shouldShow: boolean }[] = [];

        const shouldShowEth = !debouncedValue.includes('.eth') && isEthRegistered && !isEthLoading;
        if (shouldShowEth) {
            domains.push({
                ens: handleNormalizeEns(debouncedValue, "eth"),
                shouldShow: true
            });
        }
        
        const shouldShowBox = !debouncedValue.includes('.box') && isBoxRegistered && !isBoxLoading;
        if (shouldShowBox) {
            domains.push({
                ens: handleNormalizeEns(debouncedValue, "box"),
                shouldShow: true
            });
        }

        const shouldShowBase = !debouncedValue.includes('.base.eth') && isBaseRegistered && !isBaseLoading;
        if (shouldShowBase) {
            domains.push({
                ens: handleNormalizeEns(debouncedValue, "base.eth"),
                shouldShow: true
            });
        }

        // const shouldShowJustaName = !debouncedValue.includes(clientEnv.justaNameEns) &&
        //     subnames.domains.some((subname) => {
        //         if (typeof subname === 'string') return subname.endsWith(clientEnv.justaNameEns);
        //         return subname.ens.endsWith(clientEnv.justaNameEns);
        //     });
        //
        // if (shouldShowJustaName) {
        //     domains.push({
        //         ens: handleNormalizeEns(debouncedValue, clientEnv.justaNameEns),
        //         shouldShow: true
        //     });
        // }

        const shouldShowLetsTalk = !debouncedValue.includes('.letstalk.eth') && isLetsTalkRegistered && !isLetsTalkLoading;
        if (shouldShowLetsTalk) {
            domains.push({
                ens: handleNormalizeEns(debouncedValue, "letstalk.eth"),
                shouldShow: true
            });
        }

        return domains.filter((domain, index, self) =>
            index === self.findIndex((d) => d.ens === domain.ens)
        );
    }, [debouncedValue, isEthRegistered, isEthLoading, isBoxRegistered, isBoxLoading, isBaseRegistered, isBaseLoading, isLetsTalkLoading, isLetsTalkRegistered]);

    // const filteredSubnames = useMemo(() => {
    //     const manualDomainNames = manualDomains.map(d => d.ens);
    //
    //     return subnames.domains
    //         .filter((domain) => typeof domain !== 'string')
    //         .filter((domain) => !manualDomainNames.includes(domain.ens));
    // }, [subnames.domains, manualDomains]);

    const isAnyLoading = useMemo(() => {
        if (!shouldFetchData) return false;

        // return isSubnamesLoading ||
        //     isEthLoading ||
        //     isBoxLoading ||
        //     isBaseLoading;
        return isEthLoading ||
            isBoxLoading ||
            isBaseLoading ||
            isLetsTalkLoading
    }, [shouldFetchData,
        // isSubnamesLoading,
        isLetsTalkLoading,
        isEthLoading, isBoxLoading, isBaseLoading]);

    // const hasResults = useMemo(() => {
    //     return manualDomains.length > 0 || filteredSubnames.length > 0;
    // }, [manualDomains.length, filteredSubnames.length]);

    const hasResults = useMemo(() => {
        return manualDomains.length > 0;
    }, [manualDomains.length]);

    const shouldShowDropdown = useMemo(() => {
        return shouldFetchData && (isAnyLoading || hasResults);
    }, [shouldFetchData, isAnyLoading, hasResults]);

    const handleSearchClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onActiveChange(true);
    };

    const handleSearchBlur = (e: React.FocusEvent) => {
        setTimeout(() => {
            if (!hasResults || !e.relatedTarget) {
                setSearchValue("");
                onActiveChange(false);
            }
        }, 150);
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    const handleItemSelect = (ens: string) => {
        setSearchValue("");
        onActiveChange(false);
        router.push(`/${ens}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setSearchValue("");
            onActiveChange(false);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            router.push(`/${searchValue}`);
        }
    };

    useEffect(() => {
        if (isSearchActive && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchActive]);

    // console.log(manualDomains, filteredSubnames)
    if (isSearchActive) {
        return (
            <div className="w-full relative z-[100]">
                <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onBlur={handleSearchBlur}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-white"
                />
                {shouldShowDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                        {isAnyLoading ? (
                            <div className="p-2">
                                <SearchSkeleton number={4} />
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {manualDomains.map((domain) => (
                                    <SearchItem
                                        key={domain.ens}
                                        ens={domain.ens}
                                        onSelect={handleItemSelect}
                                    />
                                ))}
                                {/*{filteredSubnames.map((domain) => (*/}
                                {/*    <SearchItem*/}
                                {/*        key={domain.ens}*/}
                                {/*        ens={domain.ens}*/}
                                {/*        onSelect={handleItemSelect}*/}
                                {/*    />*/}
                                {/*))}*/}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-row items-center gap-2">
            {!onlyIcon && (
                <Button onClick={handleSearchClick} variant={"icon"}>
                    <SearchIcon />
                </Button>
            )}
            {onlyIcon && <SearchIcon onClick={handleSearchClick} className="cursor-pointer" />}
        </div>
    );
}
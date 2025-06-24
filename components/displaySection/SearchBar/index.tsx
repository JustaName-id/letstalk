import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { handleNormalizeEns } from "@/lib/helpers"
import { SearchIcon } from "@/lib/icons"
import { useEnsIsRegistered } from "@/query/ens"
import { clientEnv } from "@/utils/config/clientEnv"
import { useSearchSubnames } from "@justaname.id/react"
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
    const { subnames, isSubnamesLoading } = useSearchSubnames({
        name: debouncedValue,
        chainId: clientEnv.chainId,
        enabled: debouncedValue.length > 2,
    });
    const router = useRouter()

    const {
        isRegistered,
        isIsRegisteredLoading
    } = useEnsIsRegistered(
        handleNormalizeEns(debouncedValue, "eth"))
    const {
        isRegistered: isBoxRegistered,
        isIsRegisteredLoading: isBoxIsRegisteredLoading
    } = useEnsIsRegistered(
        handleNormalizeEns(debouncedValue, "box")
    );
    const {
        isRegistered: isBaseRegistered,
        isIsRegisteredLoading: isBaseIsRegisteredLoading
    } = useEnsIsRegistered(
        handleNormalizeEns(debouncedValue, "base.eth")
    );

    const {
        isRegistered: isLetsTalkRegistered,
        isIsRegisteredLoading: isLetsTalkIsRegisteredLoading
    } = useEnsIsRegistered(
        handleNormalizeEns(debouncedValue, clientEnv.justaNameEns)
    );

    const shouldShowEthDomain = useMemo(() => {
        const isNotAlreadyInInput = !debouncedValue.includes('.eth');
        const isValidAndRegistered = isRegistered && !isIsRegisteredLoading;
        return isNotAlreadyInInput && isValidAndRegistered;
    }, [debouncedValue, isRegistered, isIsRegisteredLoading]);

    const shouldShowBoxDomain = useMemo(() => {
        const isNotAlreadyInInput = !debouncedValue.includes('.box');
        const isValidAndRegistered = isBoxRegistered && !isBoxIsRegisteredLoading;
        return isNotAlreadyInInput && isValidAndRegistered;
    }, [debouncedValue, isBoxRegistered, isBoxIsRegisteredLoading]);

    const shouldShowBaseDomain = useMemo(() => {
        const isNotAlreadyInInput = !debouncedValue.includes('.base.eth');
        const isValidAndRegistered = isBaseRegistered && !isBaseIsRegisteredLoading;
        return isNotAlreadyInInput && isValidAndRegistered;
    }, [debouncedValue, isBaseRegistered, isBaseIsRegisteredLoading]);

    const shouldShowJustaNameDomain = useMemo(() => {
        const isNotAlreadyInInput = !debouncedValue.includes(clientEnv.justaNameEns);
        const isValidAndRegistered = isLetsTalkRegistered && !isLetsTalkIsRegisteredLoading;
        return isNotAlreadyInInput && isValidAndRegistered;
    }, [debouncedValue, isLetsTalkRegistered, isLetsTalkIsRegisteredLoading, clientEnv.justaNameEns]);

    const filteredSubnames = useMemo(() => {
        const manualDomains: string[] = [];

        if (shouldShowEthDomain) {
            manualDomains.push(handleNormalizeEns(debouncedValue, "eth"));
        }
        if (shouldShowBoxDomain) {
            manualDomains.push(handleNormalizeEns(debouncedValue, "box"));
        }
        if (shouldShowBaseDomain) {
            manualDomains.push(handleNormalizeEns(debouncedValue, "base.eth"));
        }
        if (shouldShowJustaNameDomain) {
            manualDomains.push(handleNormalizeEns(debouncedValue, clientEnv.justaNameEns));
        }

        return subnames.domains
            .filter((domain) => typeof domain !== 'string')
            .filter((domain) => !manualDomains.includes(domain.ens));
    }, [subnames.domains, shouldShowEthDomain, shouldShowBoxDomain, shouldShowBaseDomain, shouldShowJustaNameDomain, debouncedValue, clientEnv.justaNameEns]);

    const handleSearchClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onActiveChange(true);
    };

    const handleSearchBlur = (e: React.FocusEvent) => {
        setTimeout(() => {
            if (subnames.domains.length === 0 || !e.relatedTarget) {
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
                {subnames.domains.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                        {isSubnamesLoading ? (
                            <div className="p-2">
                                <SearchSkeleton number={4} />
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {shouldShowEthDomain && (
                                    <SearchItem ens={handleNormalizeEns(debouncedValue, "eth")} onSelect={handleItemSelect} />
                                )}
                                {shouldShowBoxDomain && (
                                    <SearchItem ens={handleNormalizeEns(debouncedValue, "box")} onSelect={handleItemSelect} />
                                )}
                                {shouldShowBaseDomain && (
                                    <SearchItem ens={handleNormalizeEns(debouncedValue, "base.eth")} onSelect={handleItemSelect} />
                                )}
                                {shouldShowJustaNameDomain && (
                                    <SearchItem ens={handleNormalizeEns(debouncedValue, clientEnv.justaNameEns)} onSelect={handleItemSelect} />
                                )}
                                {filteredSubnames.map((domain) => (
                                    <SearchItem key={domain.ens} ens={domain.ens} onSelect={handleItemSelect} />
                                ))}
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
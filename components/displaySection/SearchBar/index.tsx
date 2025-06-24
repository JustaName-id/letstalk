import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "@/lib/icons"
import { clientEnv } from "@/utils/config/clientEnv"
import { useSearchSubnames } from "@justaname.id/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
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
    const [debouncedValue, setValue] = useDebounceValue("", 150)
    const { subnames, isSubnamesLoading } = useSearchSubnames({
        name: debouncedValue,
        chainId: clientEnv.chainId,
        enabled: debouncedValue.length > 2,
    });
    const router = useRouter()

    const handleSearchClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onActiveChange(true);
    };

    const handleSearchBlur = (e: React.FocusEvent) => {
        setTimeout(() => {
            if (subnames.domains.length === 0 || !e.relatedTarget) {
                setValue("");
                onActiveChange(false);
            }
        }, 150);
    };

    const handleSearchChange = (value: string) => {
        setValue(value);
    };

    const handleItemSelect = (ens: string) => {
        setValue("");
        onActiveChange(false);
        window.location.href = `/${ens}`;
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setValue("");
            onActiveChange(false);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            router.push(`/${debouncedValue}`);
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
                    onBlur={handleSearchBlur}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full"
                />
                {subnames.domains.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                        {isSubnamesLoading ? (
                            <div className="p-2">
                                <SearchSkeleton number={4} />
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {subnames.domains.filter((domain) => typeof domain !== 'string').map((domain) => (
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
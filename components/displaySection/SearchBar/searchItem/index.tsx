import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { clientEnv } from '@/utils/config/clientEnv';
import { useEnsAvatar } from '@justaname.id/react';
import React from 'react';

export interface SearchItemProps {
    ens: string;
    onSelect: (ens: string) => void;
}


export const SearchItem: React.FC<SearchItemProps> = ({
    ens,
    onSelect,
}) => {
    const { avatar, isLoading } = useEnsAvatar({ ens: ens, chainId: clientEnv.chainId, enabled: !!ens });

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(ens);
    };

    return (
        <div
            className={`flex flex-row items-center gap-3 py-4 px-5 justify-start cursor-pointer hover:bg-gray-50 rounded-md transition-colors`}
            onClick={handleClick}
            onMouseDown={(e) => e.preventDefault()}
        >
            <Avatar className="h-[30px] w-[30px] rounded-full" >
                <AvatarImage src={isLoading ? undefined : !avatar ? "/avatar/fallback.webp" : avatar} />
            </Avatar>
            <div className="space-y-2 flex-1 ">
                <p className="text-sm font-medium">{ens}</p>
            </div>
        </div>
    )
}

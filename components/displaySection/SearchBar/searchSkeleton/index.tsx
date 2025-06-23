import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export interface SearchSkeletonProps {
  number?: number;
}


export const SearchSkeleton: React.FC<SearchSkeletonProps> = ({
  number = 4,
}) => {
  return (
    <>
      {
        Array.from(Array(number).keys()).map((i) => (
          <div key={`search-skeleton-${i}`} className={`flex flex-row items-center gap-[5px] py-1.5 px-5 justify-start`}>
            <Skeleton className="h-[30px] w-[30px] rounded-full" />
            <Skeleton className="h-3 w-[70px] rounded-[3px]" />
          </div>
        ))
      }
    </>
  )
}

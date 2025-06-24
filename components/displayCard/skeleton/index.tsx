import { Skeleton } from "@/components/ui/skeleton"

export const DisplayCardSkeleton = () => {
    return (
        <div className={`flex flex-col px-[5%] gap-5 items-center w-full overflow-hidden justify-start relative`}>
            <div className={`w-full !min-h-[490px] py-[40px] relative overflow-hidden`}>
                <div className={`flex bg-white relative flex-col h-full flex-1 border-[3px] border-[#E4E4E7]  rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.10),_0px_10px_10px_-5px_rgba(0,0,0,0.04)] p-4 gap-3`} >
                    <div className={`flex flex-col gap-3 z-[2]`}>
                        <div className="flex flex-row w-full items-center gap-2.5">
                            <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
                            <div className="flex flex-col gap-1">
                                <Skeleton className="w-full h-2 rounded-[6px]" />
                                <Skeleton className="w-full h-2 rounded-[6px]" />
                            </div>
                        </div>
                        <Skeleton className="w-full h-2 rounded-[6px]" />
                    </div>
                    <Skeleton className="w-full h-[57px] rounded-[6px]" />
                    <div className={`grid grid-cols-2 gap-2.5 gap-y-2.5`}>
                        <Skeleton className="h-[57px] rounded-[6px] w-full col-span-2" />
                        <Skeleton className="h-[57px] rounded-[6px] w-full col-span-1" />
                        <Skeleton className="h-[57px] rounded-[6px] w-full col-span-1" />
                        <Skeleton className="h-[57px] rounded-[6px] w-full col-span-1" />
                        <Skeleton className="h-[57px] rounded-[6px] w-full col-span-1" />
                    </div>
                </div >
            </div>
        </div>
    )
}
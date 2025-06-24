import { DisplaySection } from "@/components/displaySection";
import { getEfpStats } from "@/lib/efp";
import { getEnsRecords } from "@/lib/ens";

export default async function EnsPage({ params }: { params: Promise<{ ens: string }> }) {
    const { ens } = await params;

    const subname = await getEnsRecords(ens);
    const efpStats = await getEfpStats(ens);


    if (!subname) {
        return (
            <div className="flex items-center h-full px-[5%] flex-1 justify-center">
                <p className="text-lg text-center text-muted-foreground">ENS name: {ens} not found or has no records.</p>
            </div>
        );
    }
    return (
        <DisplaySection ens={decodeURIComponent(ens)} subname={subname} efpStats={efpStats} />
    );
} 
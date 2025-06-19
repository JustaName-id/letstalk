import { DisplaySection } from "@/components/displaySection";
import { getEnsRecords } from "@/lib/ens";

export default async function EnsPage({ params }: { params: Promise<{ ens: string }> }) {
    const { ens } = await params;

    const records = await getEnsRecords(ens);

    const initialRecords = records;

    if (!initialRecords) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-lg text-center text-muted-foreground">ENS name: {ens} not found or has no records.</p>
            </div>
        );
    }
    return (
        <DisplaySection ens={ens} className="min-h-[calc(100vh-40px)] h-full" records={initialRecords} />
    );
} 
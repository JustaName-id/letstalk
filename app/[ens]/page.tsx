
import { DisplaySection } from "@/components/displaySection";

export default async function EnsPage({ params }: { params: Promise<{ ens: string }> }) {
    const { ens } = await params;
    return (
        <DisplaySection ens={decodeURIComponent(ens)} />
    );
} 
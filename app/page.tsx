import { DisplaySection } from "@/components/displaySection";
import { getEfpStats } from "@/lib/efp";
import { getEnsRecords } from "@/lib/ens";

export default async function HomePage() {

  const displayEns = "ens.eth";

  const records = await getEnsRecords(displayEns);
  const efpStats = await getEfpStats(displayEns);

  const initialRecords = records;

  if (!initialRecords) {
    return (
      <div className="flex items-center flex-1 justify-center">
        <p className="text-lg text-center text-muted-foreground">ENS name {displayEns} not found or has no records.</p>
      </div>
    );
  }
  return (
    <DisplaySection ens={displayEns} records={initialRecords} efpStats={efpStats} />
  );
} 
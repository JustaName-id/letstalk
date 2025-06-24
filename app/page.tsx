import { DisplaySection } from "@/components/displaySection";
import { getEfpStats } from "@/lib/efp";
import { getEnsRecords } from "@/lib/ens";

export default async function HomePage() {

  const displayEns = "ens.eth";

  const subname = await getEnsRecords(displayEns);
  const efpStats = await getEfpStats(displayEns);


  if (!subname) {
    return (
      <div className="flex items-center h-full px-[5%] flex-1 justify-center">
        <p className="text-lg text-center text-muted-foreground">ENS name {displayEns} not found or has no records.</p>
      </div>
    );
  }
  return (
    <DisplaySection homePage ens={displayEns} subname={subname} efpStats={efpStats} />
  );
} 
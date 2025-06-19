import { DisplaySection } from "@/components/displaySection";
import { getEnsRecords } from "@/lib/ens";

export default async function HomePage() {

  const records = await getEnsRecords("nick.eth");

  const initialRecords = records;

  if (!initialRecords) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-center text-muted-foreground">ENS name "nick.eth" not found or has no records.</p>
      </div>
    );
  }
  return (
    <DisplaySection ens={"nick.eth"} className="h-full" records={initialRecords} />
  );
} 
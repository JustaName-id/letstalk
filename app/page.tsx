import { DisplaySection } from "@/components/displaySection";
import { getEnsRecords } from "@/lib/ens";

export default async function HomePage() {

  const records = await getEnsRecords("nick.eth");

  const initialRecords = records;

  if (!initialRecords) {
    return (
      <div className="flex items-center flex-1 justify-center h-[calc(100vh-40px)]">
        <p className="text-lg text-center text-muted-foreground">ENS name nick.eth not found or has no records.</p>
      </div>
    );
  }
  return (
    <DisplaySection ens={"nick.eth"} className="!h-[calc(100vh-40px)]" records={initialRecords} />
  );
} 
import { DisplaySection } from "@/components/displaySection";

export default async function HomePage() {

  const displayEns = "ens.eth";
  return (
    <DisplaySection homePage ens={displayEns} />
  );
} 
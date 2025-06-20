import { SanitizedRecords, sanitizeRecords } from "@justaname.id/sdk";
import { normalize } from 'viem/ens';
import { getJustaname } from "./justaname";

export async function getEnsRecords(ens: string): Promise<SanitizedRecords | null> {
  try {
    const justaName = getJustaname()

    const records = await justaName.subnames.getRecords({
        ens: normalize(decodeURIComponent(ens)),
        // chainId: serverEnv.chainId,
    });
    return sanitizeRecords(records);
    
  } catch (error) {
    console.error(`Error fetching ENS records for ${ens}:`, error);
    return null;
  }
} 
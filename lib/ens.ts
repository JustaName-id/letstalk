import { SubnameResponse } from "@justaname.id/sdk";
import { normalize } from 'viem/ens';
import { getJustaname } from "./justaname";

export async function getEnsRecords(ens: string): Promise<SubnameResponse | null> {
  try {
    const justaName = getJustaname()

    const subname = await justaName.subnames.getRecords({
        ens: normalize(decodeURIComponent(ens)),
    });
    return subname;
    
  } catch (error) {
    console.error(`Error fetching ENS records for ${ens}:`, error);
    return null;
  }
} 
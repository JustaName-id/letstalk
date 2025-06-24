import { SubnameResponse } from "@justaname.id/sdk";
import { normalize } from 'viem/ens';
import { getJustaname } from "./justaname";
import { serverEnv } from "@/utils/config/serverEnv";

export async function getEnsRecords(ens: string): Promise<SubnameResponse | null> {
  try {
    const justaName = getJustaname()

    const subname = await justaName.subnames.getSubname({
        subname: normalize(decodeURIComponent(ens)),
        chainId: serverEnv.chainId,
    });
    return subname;
    
  } catch (error) {
    console.error(`Error fetching ENS records for ${ens}:`, error);
    return null;
  }
} 
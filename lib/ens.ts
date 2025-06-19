import { serverEnv } from "@/utils/config/serverEnv";
import { JustaName, SanitizedRecords, sanitizeRecords,  } from "@justaname.id/sdk";
import { normalize } from 'viem/ens';

export async function getEnsRecords(ens: string): Promise<SanitizedRecords | null> {
  try {
    const justaName = JustaName.init({
        networks: [
            {
              chainId: serverEnv.chainId,
              providerUrl: serverEnv.providerUrl
            }
        ],
        config: {
            domain: serverEnv.justaNameDomain,
            origin: serverEnv.justaNameOrigin
        },
        dev: serverEnv.devMode
    })

    const records = await justaName.subnames.getRecords({
        ens: normalize(ens),
        chainId: serverEnv.chainId,
    });
    return sanitizeRecords(records);
    
  } catch (error) {
    console.error(`Error fetching ENS records for ${ens}:`, error);
    return null;
  }
} 
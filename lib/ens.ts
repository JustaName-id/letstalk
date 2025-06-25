import { serverEnv } from "@/utils/config/serverEnv";
import { addEnsContracts } from '@ensdomains/ensjs';
import { getRecords as getEnsRecords } from '@ensdomains/ensjs/public';
import { sanitizeRecords } from "@justaname.id/sdk";
import { createPublicClient, http } from "viem";
import { mainnet, sepolia } from "viem/chains";
import { normalize } from 'viem/ens';
import { checkEnsValid, validateEns } from "./helpers";
import { getEfpStats } from "./efp";

export interface StandardRecords {
    ens: string;
    address: string;
    bio: string | null;
    followers: number | null;
    following: number | null;
    header: string | null;
    avatar: string | null;
    website: string | null;
    display: string | null;
    telegram: string | null;
    x: string | null;
    github: string | null;
    discord: string | null;
}

const GENERAL_KEYS = [
    "avatar",
    "display",
    "header",
    "banner",
    "description",
]

const SOCIAL_KEYS = [
    "url",
    "org.telegram",
    "com.x",
    "com.twitter",
    "com.github",
    "com.discord",
]


const sanitizeEnsImage = (avatar: string, name: string) => {
    if (avatar?.startsWith('eip')) {
      avatar = `https://metadata.ens.domains/${
        serverEnv.chainId === 1 ? 'mainnet' : 'sepolia'
      }/avatar/${name}`;
    }

    if (avatar?.startsWith('ipfs')) {
      avatar = `https://ipfs.io/ipfs/${avatar.replace('ipfs://', '')}`;
    }

    return avatar;
  };

export const getStandardRecords = async (
    ens: string
): Promise<StandardRecords> => {

    const ensClient = createPublicClient({
        chain: addEnsContracts(serverEnv.chainId === 1 ? mainnet : sepolia),
        transport: http(serverEnv.providerUrl),
      });
      
  if (!ensClient) {
    throw new Error('Public client not found');
  }

  const _ens = normalize(ens);

  if (!_ens) {
    throw new Error('Invalid ENS name');
  }

  if (!validateEns(_ens)) {
    throw new Error('Invalid ENS name');
  }

  const result = await getEnsRecords(ensClient, {
    name: _ens,
    coins: ["60"],
    texts: [
      ...GENERAL_KEYS,
      ...SOCIAL_KEYS,
    ],
    contentHash: true,
  });

  const record = {
    ens: _ens,
    isJAN: false,
    records: {
      ...result,
      contentHash: {
        protocolType: result.contentHash?.protocolType || '',
        decoded: result.contentHash?.decoded || '',
      },
    },
  };

  
  checkEnsValid(record);
  const sanitized = sanitizeRecords(record);

  const efpStats = await getEfpStats(sanitized.ethAddress.value)

  return {
    ens: record.ens,
    address: sanitized.ethAddress.value,
    bio: sanitized.description || null,
    followers: efpStats?.followers_count ? parseInt(efpStats.followers_count) : 0,
    following: efpStats?.following_count ? parseInt(efpStats.following_count) : 0,
    website: sanitized.url || null,
    avatar: sanitized.avatar ? sanitizeEnsImage(sanitized.avatar, record.ens) : null,
    header: sanitized.header || sanitized.banner || null,
    display: sanitized.display || null,
    telegram: sanitized.socials?.find((social) => social.key === "org.telegram")?.value || null,
    x: sanitized.socials?.find((social) => social.key === "com.x" || social.key === "com.twitter")?.value || null,
    github: sanitized.socials?.find((social) => social.key === "com.github")?.value || null,
    discord: sanitized.socials?.find((social) => social.key === "com.discord")?.value || null,
  };
};
import { z } from 'zod';

const CLIENT_ENV = {
  websiteUrl: process.env.NEXT_PUBLIC_URL,
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
  providerUrl: process.env.NEXT_PUBLIC_PROVIDER_URL,
  devMode: process.env.NEXT_PUBLIC_DEV === "true",
  justaNameDomain: process.env.NEXT_PUBLIC_JUSTANAME_DOMAIN,
  justaNameOrigin: process.env.NEXT_PUBLIC_JUSTANAME_ORIGIN,
  justaNameEns: process.env.NEXT_PUBLIC_JUSTANAME_ENS,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
};

export const clientEnvSchema = z.object({
  websiteUrl: z.string(),
  chainId: z.preprocess(
    (val) => (typeof val === 'string' && val !== '' ? parseInt(val, 10) : val),
    z.union([z.literal(1), z.literal(11155111)])
  ).default(11155111),
  providerUrl: z.string(),
  devMode: z.boolean().default(false),
  justaNameDomain: z.string(),
  justaNameOrigin: z.string(),
  justaNameEns: z.string(),
  projectId: z.string(),
})

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export const clientEnv: ClientEnv = clientEnvSchema.parse(CLIENT_ENV);

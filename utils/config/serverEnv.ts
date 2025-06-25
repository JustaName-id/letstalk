import { z } from 'zod';

const SERVER_ENV = {
  chainId: process.env.CHAIN_ID,
  justaNameDomain: process.env.JUSTANAME_DOMAIN,
  justaNameOrigin: process.env.JUSTANAME_ORIGIN,
  providerUrl: process.env.PROVIDER_URL,
  devMode: process.env.DEV === "true",
  justaNameApiKey: process.env.JUSTANAME_API_KEY,
  justaNameEnsDomain: process.env.JUSTANAME_ENS,
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION,

};

export const serverEnvSchema = z.object({
  chainId: z.preprocess(
    (val) => (typeof val === 'string' && val !== '' ? parseInt(val, 10) : val),
    z.union([z.literal(1), z.literal(11155111)])
  ).default(11155111),
  justaNameDomain: z.string(),
  justaNameOrigin: z.string(),
  providerUrl: z.string(),
  devMode: z.boolean().default(false),
  justaNameApiKey: z.string(),
  justaNameEnsDomain: z.string(),
  googleSiteVerification: z.string(),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const serverEnv: ServerEnv = serverEnvSchema.parse(SERVER_ENV);

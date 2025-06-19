import { serverEnv } from '@/utils/config/serverEnv';
import { JustaName } from '@justaname.id/sdk';

let justaname: JustaName | undefined;

export const getJustaname = () => {
  if (!justaname) {
    justaname = JustaName.init({
      dev: serverEnv.devMode,
      networks: [
        {
          chainId: serverEnv.chainId,
          providerUrl: serverEnv.providerUrl,
        },
      ],
      ensDomains: [
        {
          chainId: serverEnv.chainId,
          apiKey: serverEnv.justaNameApiKey,
          ensDomain: serverEnv.justaNameEnsDomain,
        },
      ],
    });
  }

  return justaname;
};

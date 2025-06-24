import { clientEnv } from "@/utils/config/clientEnv";
import { OffchainResolverGetAllResponse, SanitizedRecords } from "@justaname.id/sdk";

const ENS_MAINNET_RESOLVER = ['0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41', '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63'];
const ENS_SEPOLIA_RESOLVER = '0x8FADE66B79cC9f707aB26799354482EB93a5B7dD';

export const getSocials = (records?: SanitizedRecords | null) => {
    if (!records) {
        return {
            avatar: "",
            header: "",
            display: "",
            description: "",
            url: "",
            github: "",
            discord: "",
            x: "",
            telegram: "",
        };
    }

    const github = records.socials.find((social) => social.name === "Github")?.value || "";
    const discord = records.socials.find((social) => social.name === "Discord")?.value || "";
    const x = records.socials.find((social) => social.name === "X")?.value ||
        records.socials.find((social) => social.name === "Twitter")?.value || "";
    const telegram = records.socials.find((social) => social.name === "Telegram")?.value || "";

    return {
        avatar: records.avatar || "",
        header: records.header || records.banner || "",
        display: records.display || "",
        description: records.description || "",
        url: records.url || "",
        github,
        discord,
        x,
        telegram,
    };
}


export const checkIfMyCard = (resolverAddress: string, offchainResolvers: OffchainResolverGetAllResponse ) => {
    const resolverAddresses =
          clientEnv.chainId === 1 ? ENS_MAINNET_RESOLVER : [ENS_SEPOLIA_RESOLVER];
        const offchainResolver = offchainResolvers?.offchainResolvers.find(
          (resolver) => resolver.chainId === clientEnv.chainId
        );

        return (
          resolverAddresses.includes(resolverAddress) ||
          resolverAddress === offchainResolver?.resolverAddress
        );
}
import { SanitizedRecords } from "@justaname.id/sdk";

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
import { DiscordIcon, GithubIcon, GlobeIcon, TelegramIcon, XIcon } from "@/lib/icons";
import { transformToKeyValuePairs, UpdateEnsFormData, updateEnsSchema } from "@/types/form";
import { clientEnv } from "@/utils/config/clientEnv";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateSubname } from "@justaname.id/react";
import { SanitizedRecords } from "@justaname.id/sdk";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDisconnect } from "wagmi";
import { Button } from "../../ui/button";
import { Form } from "../../ui/form";
import { FormInputField } from "../../ui/form-input-field";
import { AvatarEditorDialog } from "./avatarSelectorDialog";
import { BannerEditorDialog } from "./bannerSelectorDialog";

export interface UpdateEnsSectionProps {
    subname: string;
    initialRecords?: SanitizedRecords | null;
}

export const UpdateEnsSection = ({ subname, initialRecords }: UpdateEnsSectionProps) => {
    const { disconnect } = useDisconnect();
    const { updateSubname, isUpdateSubnamePending } = useUpdateSubname({
        chainId: clientEnv.chainId,
    });

    // Extract initial values from records
    const initialValues = useMemo(() => {
        if (!initialRecords) {
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

        const github = initialRecords.socials.find((social) => social.name === "Github")?.value || "";
        const discord = initialRecords.socials.find((social) => social.name === "Discord")?.value || "";
        const x = initialRecords.socials.find((social) => social.name === "X")?.value ||
            initialRecords.socials.find((social) => social.name === "Twitter")?.value || "";
        const telegram = initialRecords.socials.find((social) => social.name === "Telegram")?.value || "";

        return {
            avatar: initialRecords.avatar || "",
            header: initialRecords.header || initialRecords.banner || "",
            display: initialRecords.display || "",
            description: initialRecords.description || "",
            url: initialRecords.url || "",
            github,
            discord,
            x,
            telegram,
        };
    }, [initialRecords]);

    const [avatar, setAvatar] = useState<string>(initialValues.avatar);
    const [banner, setBanner] = useState<string>(initialValues.header);
    const router = useRouter()

    const form = useForm<UpdateEnsFormData>({
        resolver: zodResolver(updateEnsSchema),
        defaultValues: initialValues,
    });

    const onSubmit = (data: UpdateEnsFormData) => {
        const records = transformToKeyValuePairs(data);

        if (avatar) {
            records.push({ key: "avatar", value: avatar });
        }

        if (banner) {
            records.push({ key: "header", value: banner });
        }

        updateSubname({
            ens: subname,
            chainId: clientEnv.chainId,
            text: records,
        }, {
            onSuccess: () => {
                router.push(`/${subname}`);
            }
        });
    };

    const handleAvatarChange = (imageUrl: string) => {
        setAvatar(imageUrl);
    };

    const handleBannerChange = (imageUrl: string) => {
        setBanner(imageUrl);
    };

    return (
        <div className="flex flex-col w-full h-full gap-6">
            <div className="flex flex-col gap-2.5">
                <h1 className="text-foreground text-[30px] font-normal leading-[100%]">Update Your ENS Profile</h1>
                <p className="text-xs text-muted-foreground font-normal leading-[133%]">Fill in your profile information to create your ENS business card.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full mt-10 flex-col justify-start gap-5">
                    <div className="flex flex-col gap-2.5">
                        <div className="flex flex-row w-full gap-2.5 items-center">
                            <AvatarEditorDialog
                                onImageChange={handleAvatarChange}
                                avatar={avatar}
                                subname={subname}
                            />
                            <BannerEditorDialog
                                onImageChange={handleBannerChange}
                                banner={banner}
                                subname={subname}
                            />
                        </div>
                        <div className="flex flex-col gap-2.5 w-full">
                            <FormInputField
                                control={form.control}
                                name="display"
                                placeholder="Display Name"
                            />
                            <FormInputField
                                control={form.control}
                                name="description"
                                placeholder="Bio"
                                type="textarea"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2.5 w-full">
                        <p className="text-xl text-foreground font-normal leading-[100%]">Add Your Metadata</p>
                        <div className="flex flex-row gap-2 w-full items-center">
                            <GlobeIcon width={24} height={24} />
                            <FormInputField
                                className="w-full"
                                control={form.control}
                                name="url"
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="flex flex-row gap-2 w-full items-center">
                            <TelegramIcon width={24} height={24} />
                            <FormInputField
                                className="w-full"
                                control={form.control}
                                name="telegram"
                                placeholder="username"
                            />
                        </div>

                        <div className="flex flex-row gap-2 w-full items-center">
                            <XIcon width={24} height={24} />
                            <FormInputField
                                className="w-full"
                                control={form.control}
                                name="x"
                                placeholder="username"
                            />
                        </div>
                        <div className="flex flex-row gap-2 w-full items-center">
                            <GithubIcon width={24} height={24} />
                            <FormInputField
                                className="w-full"
                                control={form.control}
                                name="github"
                                placeholder="username"
                            />
                        </div>
                        <div className="flex flex-row gap-2 w-full items-center">
                            <DiscordIcon width={24} height={24} />
                            <FormInputField
                                className="w-full"
                                control={form.control}
                                name="discord"
                                placeholder="username"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex mt-auto flex-row gap-4 justify-between items-center">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => disconnect()}
                        >
                            Disconnect
                        </Button>
                        <Button
                            type="submit"
                            disabled={isUpdateSubnamePending}
                        >
                            {isUpdateSubnamePending ? "Creating..." : "Save Card!"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
import { FormRecords } from "@/types/form";
import { clientEnv } from "@/utils/config/clientEnv";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateSubname } from "@justaname.id/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, useDisconnect } from "wagmi";
import { z } from "zod";
import { Button } from "../../ui/button";
import { Form } from "../../ui/form";
import { FormInputField } from "../../ui/form-input-field";
import { DiscordIcon, GithubIcon, GlobeIcon, TelegramIcon, XIcon } from "@/lib/icons";
import { AvatarEditorDialog } from "./avatarSelectorDialog";

const updateEnsSchema = z.object({
    avatar: z.string().optional(),
    header: z.string().optional(),
    display: z.string().optional(),
    description: z.string().optional(),
    url: z.string().optional(),
    github: z.string().optional(),
    discord: z.string().optional(),
    x: z.string().optional(),
    telegram: z.string().optional(),
});

type UpdateEnsFormData = z.infer<typeof updateEnsSchema>;

const fieldToRecordKeyMap: Record<string, string> = {
    github: "com.github",
    discord: "com.discord",
    x: "com.x",
    telegram: "org.telegram",
};

const transformToKeyValuePairs = (data: UpdateEnsFormData): FormRecords => {
    const records: FormRecords = [];

    Object.entries(data).forEach(([fieldName, value]) => {
        if (value && value.trim() !== "") {
            const recordKey = fieldToRecordKeyMap[fieldName] || fieldName;
            records.push({ key: recordKey, value: value.trim() });
        }
    });

    return records;
};

export const UpdateEnsSection = () => {
    const { disconnect } = useDisconnect();
    const { address } = useAccount();
    const { updateSubname, isUpdateSubnamePending } = useUpdateSubname({
        chainId: clientEnv.chainId,
    });
    const [avatar, setAvatar] = useState<string>("");
    const [subname] = useState("example.cardeth.eth");

    const form = useForm<UpdateEnsFormData>({
        resolver: zodResolver(updateEnsSchema),
        defaultValues: {
            avatar: "",
            header: "",
            display: "",
            description: "",
            url: "",
            github: "",
            discord: "",
            x: "",
            telegram: "",
        },
    });

    const onSubmit = (data: UpdateEnsFormData) => {
        const records = transformToKeyValuePairs(data);

        if (avatar) {
            records.push({ key: "avatar", value: avatar });
        }

        // updateSubname({
        //     subname,
        //     records: records
        // });
    };

    const handleAvatarChange = (imageUrl: string) => {
        setAvatar(imageUrl);
    };

    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex flex-col gap-2.5">
                <h1 className="text-foreground text-[30px] font-normal leading-[100%]">Update Your ENS Profile</h1>
                <p className="text-xs text-muted-foreground font-normal leading-[133%]">Fill in your profile information to create your ENS business card.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col justify-start gap-5">
                    <div className="flex flex-col gap-2.5">
                        {/* Avatar Upload Section */}
                        <div className="flex flex-row w-full gap-2.5 items-center">
                            <AvatarEditorDialog
                                onImageChange={handleAvatarChange}
                                avatar={avatar}
                                subname={subname}
                                chainId={clientEnv.chainId}
                                address={address}
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
                            <GithubIcon width={24} height={24} />
                            <FormInputField
                                className="w-full"
                                control={form.control}
                                name="github"
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
                            <DiscordIcon width={24} height={24} />
                            <FormInputField
                                className="w-full"
                                control={form.control}
                                name="discord"
                                placeholder="username"
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
                            {isUpdateSubnamePending ? "Updating..." : "Update Profile"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
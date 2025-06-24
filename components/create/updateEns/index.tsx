import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { getSocials } from "@/lib/helpers";
import { DiscordIcon, GithubIcon, GlobeIcon, TelegramIcon, XIcon } from "@/lib/icons";
import { fieldToRecordKeyMap, transformToKeyValuePairs, UpdateEnsFormData, updateEnsSchema } from "@/types/form";
import { clientEnv } from "@/utils/config/clientEnv";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRecords, useUpdateSubname } from "@justaname.id/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Form } from "../../ui/form";
import { FormInputField } from "../../ui/form-input-field";
import { AvatarEditorDialog } from "./avatarSelectorDialog";
import { BannerEditorDialog } from "./bannerSelectorDialog";

export interface UpdateEnsSectionProps {
    subname: {
        name: string;
        new: boolean;
    };
    onUpdateDrawerOpen: (open: boolean) => void;
    updateDrawerOpen: boolean;
}

export const UpdateEnsSection = ({ subname, onUpdateDrawerOpen, updateDrawerOpen }: UpdateEnsSectionProps) => {
    const router = useRouter()
    const { updateSubname, isUpdateSubnamePending } = useUpdateSubname({
        chainId: clientEnv.chainId,
    });
    const { records, isRecordsPending, refetchRecords } = useRecords({
        ens: subname.name,
        chainId: clientEnv.chainId,
        enabled: !subname.new,
    });

    const initialValues = useMemo(() => {
        return getSocials(records?.sanitizedRecords ?? undefined);
    }, [records]);

    const [avatar, setAvatar] = useState<string>(initialValues.avatar);
    const [banner, setBanner] = useState<string>(initialValues.header);

    const form = useForm<UpdateEnsFormData>({
        resolver: zodResolver(updateEnsSchema),
        defaultValues: initialValues,
        disabled: isRecordsPending,
    });

    const onSubmit = (data: UpdateEnsFormData) => {
        const records = transformToKeyValuePairs(data);

        Object.entries(data).forEach(([fieldName, value]) => {
            const initialValue = initialValues[fieldName as keyof typeof initialValues];
            const currentValue = value?.trim() || "";

            if (initialValue && initialValue.trim() !== "" && currentValue === "") {
                const recordKey = fieldToRecordKeyMap[fieldName] || fieldName;
                if (!records.find(r => r.key === recordKey)) {
                    records.push({ key: recordKey, value: "" });
                }
            }
        });

        const filteredRecords = records.filter(r => r.key !== "avatar" && r.key !== "header");

        if (initialValues.avatar && initialValues.avatar.trim() !== "" && !avatar) {
            filteredRecords.push({ key: "avatar", value: "" });
        } else if (avatar) {
            filteredRecords.push({ key: "avatar", value: avatar });
        }

        if (initialValues.header && initialValues.header.trim() !== "" && !banner) {
            filteredRecords.push({ key: "header", value: "" });
        } else if (banner) {
            filteredRecords.push({ key: "header", value: banner });
        }

        updateSubname({
            ens: subname.name,
            chainId: clientEnv.chainId,
            text: filteredRecords,
        }, {
            onSuccess: () => {
                if (subname.new) {
                    router.push(`/${subname.name}`);
                } else {
                    refetchRecords();
                }
                onUpdateDrawerOpen(false);
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
        <Drawer open={updateDrawerOpen} onOpenChange={onUpdateDrawerOpen}>
            <DrawerContent aria-describedby={undefined} >
                <div className="hidden">
                    <DrawerTitle></DrawerTitle>
                </div>
                <div className="flex flex-col w-full p-5 h-full gap-6">
                    <div className="flex flex-col gap-2.5">
                        <h1 className="text-foreground text-[30px] font-normal leading-[100%]">Update Your ENS Profile</h1>
                        <p className="text-xs text-muted-foreground font-normal leading-[133%]">Fill in your profile information for your ENS business card.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full mt-10 flex-col justify-start gap-5">
                            <div className="flex flex-col gap-2.5">
                                <div className="flex flex-row w-full gap-2.5 items-center">
                                    <AvatarEditorDialog
                                        onImageChange={handleAvatarChange}
                                        avatar={!avatar ? undefined : avatar}
                                        subname={subname.name}
                                    />
                                    <BannerEditorDialog
                                        onImageChange={handleBannerChange}
                                        banner={!banner ? undefined : banner}
                                        subname={subname.name}
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
                                        placeholder="Website"
                                    />
                                </div>
                                <div className="flex flex-row gap-2 w-full items-center">
                                    <TelegramIcon width={24} height={24} />
                                    <FormInputField
                                        className="w-full"
                                        control={form.control}
                                        name="telegram"
                                        placeholder="Telegram"
                                    />
                                </div>

                                <div className="flex flex-row gap-2 w-full items-center">
                                    <XIcon width={24} height={24} />
                                    <FormInputField
                                        className="w-full"
                                        control={form.control}
                                        name="x"
                                        placeholder="X/Twitter"
                                    />
                                </div>
                                <div className="flex flex-row gap-2 w-full items-center">
                                    <GithubIcon width={24} height={24} />
                                    <FormInputField
                                        className="w-full"
                                        control={form.control}
                                        name="github"
                                        placeholder="Github"
                                    />
                                </div>
                                <div className="flex flex-row gap-2 w-full items-center">
                                    <DiscordIcon width={24} height={24} />
                                    <FormInputField
                                        className="w-full"
                                        control={form.control}
                                        name="discord"
                                        placeholder="Discord"
                                    />
                                </div>
                            </div>

                            <div className="flex mt-auto flex-row gap-4 justify-between items-center">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => onUpdateDrawerOpen(false)}
                                >
                                    Cancel
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
            </DrawerContent>
        </Drawer>
    );
};
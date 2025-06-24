import z from "zod";

export interface FormRecord {
    key: string;
    value: string;
}

export type FormRecords = FormRecord[]; 

export const updateEnsSchema = z.object({
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

export type UpdateEnsFormData = z.infer<typeof updateEnsSchema>;

export const fieldToRecordKeyMap: Record<string, string> = {
    github: "com.github",
    discord: "com.discord",
    x: "com.x",
    telegram: "org.telegram",
};

export const transformToKeyValuePairs = (data: UpdateEnsFormData): FormRecords => {
    const records: FormRecords = [];

    Object.entries(data).forEach(([fieldName, value]) => {
        if (value && value.trim() !== "") {
            const recordKey = fieldToRecordKeyMap[fieldName] || fieldName;
            records.push({ key: recordKey, value: value.trim() });
        }
    });

    return records;
};
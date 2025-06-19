import React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";

interface FormInputFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    control: Control<TFieldValues>;
    name: TName;
    label?: string;
    placeholder?: string;
    description?: string;
    type?: "text" | "email" | "url" | "textarea";
    rightText?: string;
    rightIcon?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    containerClassName?: string;
}

export function FormInputField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    placeholder,
    description,
    type = "text",
    rightText,
    rightIcon,
    disabled,
    className,
    containerClassName,
}: FormInputFieldProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full flex flex-col">
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        {type === "textarea" ? (
                            <Textarea
                                placeholder={placeholder}
                                disabled={disabled}
                                className={className}
                                {...field}
                            />
                        ) : (
                            <Input
                                type={type}
                                placeholder={placeholder}
                                rightText={rightText}
                                rightIcon={rightIcon}
                                disabled={disabled}
                                className={className}
                                containerClassName={containerClassName}
                                {...field}
                            />
                        )}
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
} 
import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
    rightText?: string
    rightIcon?: React.ReactNode
    containerClassName?: string
}

function Input({ className, type, rightText, rightIcon, containerClassName, ...props }: InputProps) {
    const hasRightContent = rightText || rightIcon

    return (
        <div className={cn("relative w-full", containerClassName)}>
            <input
                type={type}
                data-slot="input"
                className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-[6px] border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    hasRightContent && "pr-10",
                    className
                )}
                {...props}
            />
            {hasRightContent && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {rightIcon && <span className="text-muted-foreground">{rightIcon}</span>}
                    {rightText && <span className="text-muted-foreground text-sm">{rightText}</span>}
                </div>
            )}
        </div>
    )
}

export { Input }

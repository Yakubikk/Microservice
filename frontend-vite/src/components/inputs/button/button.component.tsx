import {Loader2} from "lucide-react";
import React, {type ButtonHTMLAttributes, forwardRef} from "react";
import type {VariantProps} from "class-variance-authority";
import {buttonVariants} from "./button.variants.ts";
import {Slot} from "@radix-ui/react-slot";
import {cn} from "@/lib/utils.ts";

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : 'button';
        const showLoader = isLoading && !asChild;

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {showLoader ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        {leftIcon && <span className="mr-2">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="ml-2">{rightIcon}</span>}
                    </>
                )}
            </Comp>
        );
    }
);
Button.displayName = 'Button';

export { Button };
export default Button;

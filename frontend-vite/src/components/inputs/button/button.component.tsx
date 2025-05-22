import { Loader2 } from "lucide-react";
import React, { type ButtonHTMLAttributes, forwardRef } from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button.variants.ts";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils.ts";
import useRipple from "use-ripple-hook";
import mergeRefs from 'merge-refs'

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    noRipple?: boolean;
    rippleVariant?: 'dark' | 'light';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant = 'default',
        size,
        asChild = false,
        isLoading = false,
        leftIcon,
        rightIcon,
        children,
        disabled,
        noRipple = false,
        rippleVariant,
        ...props
    },
        ref
    ) => {
        const Comp = asChild ? Slot : 'button';
        const showLoader = isLoading && !asChild;

        const darkVariants = ['default', 'destructive', 'secondary', 'success', 'warning', 'danger', 'info'];
        const isDarkVariant = darkVariants.includes(variant as string);
        const rippleColor = rippleVariant === 'light'
            ? 'rgba(255, 255, 255, 0.2)'
            : rippleVariant === 'dark'
                ? 'rgba(0, 0, 0, 0.2)'
                : isDarkVariant
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(0, 0, 0, 0.2)';

        // Only use ripple if hasRipple is true
        const [ripple, event] = useRipple({
            disabled: noRipple,
            color: rippleColor,
        });

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={mergeRefs(ref, ripple)}
                disabled={disabled || isLoading}
                onPointerDown={event}
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

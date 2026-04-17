"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@shared/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "bordered" | "elevated" | "premium";
    interactive?: boolean;
    hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", interactive = false, hoverEffect = false, ...props }, ref) => {
        const variants = {
            // Default - Standard Card (Section 4.1)
            default: "bg-white dark:bg-[#1C252E] border border-[rgba(145,158,171,0.12)] rounded-2xl shadow-sm hover:border-[rgba(145,158,171,0.32)] hover:shadow-lg transition-all duration-300",
            // Glass - Premium Glassmorphism Card (Section 4.2)
            glass: "backdrop-blur-xl bg-white/70 dark:bg-white/[0.04] border border-white/50 dark:border-white/[0.08] rounded-3xl transition-all duration-500 hover:border-[#22C55E]/30 dark:hover:border-[#22C55E]/20 hover:shadow-[0_20px_60px_-15px_rgba(34,197,94,0.15)] hover:-translate-y-1",
            // Bordered - Highlight Feature Card (Section 4.3)
            bordered: "bg-white dark:bg-[#1C252E] border border-[rgba(145,158,171,0.12)] rounded-2xl overflow-hidden hover:border-[rgba(145,158,171,0.32)] hover:shadow-lg transition-all duration-300",
            // Elevated - CTA Section Card (Section 4.5)
            elevated: "bg-gradient-to-br from-[#22c55e]/10 via-[#10b981]/5 to-[#FFAB00]/10 border border-[#22c55e]/20 rounded-3xl shadow-lg",
            // Premium - Interactive modern green themed (Section 9.6)
            premium: "bg-white dark:bg-[#1C252E] border border-[rgba(145,158,171,0.12)] rounded-3xl shadow-md hover:border-[#22C55E]/30 hover:shadow-[0_20px_60px_-15px_rgba(34,197,94,0.15)] hover:-translate-y-1 transition-all duration-500",
        };

        const baseClasses = cn(
            "text-card-foreground",
            variants[variant],
            className
        );

        if (interactive || hoverEffect) {
            return (
                <motion.div
                    ref={ref}
                    className={baseClasses}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.99 }}
                >
                    {props.children}
                </motion.div>
            );
        }

        return (
            <div
                ref={ref}
                className={baseClasses}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-xl font-semibold leading-none tracking-tight text-[#1C252E] dark:text-white",
            className
        )}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-[#637381] dark:text-[#919EAB]", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { premiumEase } from "@/lib/animations";

type Props = HTMLMotionProps<"button"> & {
  variant?: "dark" | "light" | "outline";
};

export function Button({ className, variant = "dark", children, ...props }: Props) {
  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.015, boxShadow: variant === "dark" ? "0 0 36px rgba(199,170,115,0.28)" : "0 18px 42px rgba(0,0,0,0.12)" }}
      whileTap={{ scale: 0.965 }}
      transition={{ duration: 0.24, ease: premiumEase }}
      className={cn(
        "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "dark" && "bg-ink text-bone hover:bg-coal",
        variant === "light" && "bg-bone text-ink hover:bg-white",
        variant === "outline" && "border border-black/15 bg-transparent text-ink hover:bg-white/70",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

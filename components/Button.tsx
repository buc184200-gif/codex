"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = HTMLMotionProps<"button"> & {
  variant?: "dark" | "light" | "outline";
};

export function Button({ className, variant = "dark", children, ...props }: Props) {
  return (
    <motion.button
      whileHover={{ y: -2, boxShadow: variant === "dark" ? "0 0 32px rgba(199,170,115,0.24)" : undefined }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
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

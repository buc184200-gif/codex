"use client";

import { motion } from "framer-motion";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

export function ProductImage({
  product,
  imageIndex = 0,
  className,
  floating = false
}: {
  product: Product;
  imageIndex?: number;
  className?: string;
  floating?: boolean;
}) {
  const pattern =
    imageIndex % 3 === 1
      ? "linear-gradient(90deg, transparent 47%, rgba(255,255,255,.2) 48%, rgba(255,255,255,.2) 52%, transparent 53%)"
      : imageIndex % 3 === 2
        ? "radial-gradient(circle at 50% 23%, rgba(255,255,255,.24), transparent 11%), repeating-linear-gradient(135deg, rgba(255,255,255,.14) 0 1px, transparent 1px 9px)"
        : "linear-gradient(155deg, rgba(255,255,255,.18), transparent 42%)";

  return (
    <div className={cn("relative overflow-hidden bg-[#eee6d8]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,.85),transparent_22rem)]" />
      <motion.div
        animate={floating ? { y: [0, -12, 0], rotate: [0, -1.2, 0] } : undefined}
        transition={floating ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : undefined}
        className="product-mockup absolute inset-8 mx-auto max-w-[74%]"
      >
        <div
          className={cn(
            "absolute inset-x-0 bottom-[2%] top-[3%]",
            product.shape === "overshirt" ? "overshirt-shape" : product.shape === "shirt" ? "overshirt-shape" : "shirt-shape"
          )}
          style={{
            background: `${pattern}, linear-gradient(145deg, rgba(255,255,255,.2), transparent 32%), ${product.tone}`
          }}
        />
        <div
          className="absolute left-[46%] top-[10%] h-[78%] w-[2px] opacity-40"
          style={{ backgroundColor: product.accent }}
        />
        <div
          className="absolute left-[57%] top-[34%] h-[15%] w-[16%] border opacity-60"
          style={{ borderColor: product.accent }}
        />
        <div
          className="absolute left-[40%] top-[10%] h-[9%] w-[20%] rounded-b-full border-b-2 opacity-60"
          style={{ borderColor: product.accent }}
        />
      </motion.div>
      <div className="absolute bottom-4 left-4 rounded-full bg-white/76 px-3 py-1 text-xs text-ink backdrop-blur">
        {product.images[imageIndex] ?? "front"}
      </div>
    </div>
  );
}

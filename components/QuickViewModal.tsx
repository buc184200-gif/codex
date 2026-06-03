"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Product } from "@/types";
import { ProductImage } from "@/components/ProductImage";
import { money } from "@/lib/utils";
import { Button } from "@/components/Button";
import { useCart } from "@/store/cart-store";
import { useToast } from "@/store/toast-store";

export function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addItem } = useCart();
  const { push } = useToast();

  const add = () => {
    if (product.stock <= 0) {
      push("This piece is currently out of stock", "error");
      return;
    }
    addItem({ productId: product.id, size: product.sizes[0], color: product.colors[0], quantity: 1 });
    push(`${product.name} added to cart`);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center bg-ink/55 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 34, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        className="grid w-full max-w-3xl overflow-hidden bg-bone shadow-soft md:grid-cols-2"
        onClick={(event) => event.stopPropagation()}
      >
        <ProductImage product={product} className="min-h-[360px]" />
        <div className="p-6">
          <div className="flex justify-between gap-4">
            <p className="text-sm text-gilt">{product.category}</p>
            <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-black/10">
              <X className="h-4 w-4" />
            </button>
          </div>
          <h2 className="mt-5 font-display text-4xl">{product.name}</h2>
          <p className="mt-3 text-sm leading-6 text-smoke">{product.description}</p>
          <div className="mt-5 flex items-center gap-3">
            <span className="text-xl font-semibold">{money(product.price)}</span>
            <span className="text-sm text-smoke line-through">{money(product.originalPrice)}</span>
            <span className="rounded-full bg-ink px-3 py-1 text-xs text-bone">{product.discount}% off</span>
          </div>
          <div className="mt-6 flex gap-3">
            <Button onClick={add} disabled={product.stock <= 0}>Add to cart</Button>
            <Link href={`/products/${product.slug}`} className="inline-flex min-h-12 items-center rounded-full border border-black/15 px-6 text-sm">
              View details
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

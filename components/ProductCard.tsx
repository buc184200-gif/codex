"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { money } from "@/lib/utils";
import { ProductImage } from "@/components/ProductImage";
import { useCart } from "@/store/cart-store";
import { useToast } from "@/store/toast-store";
import { QuickViewModal } from "@/components/QuickViewModal";
import { cardMotion, premiumEase } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function ProductCard({ product, view = "grid" }: { product: Product; view?: "grid" | "list" }) {
  const { addItem } = useCart();
  const { push } = useToast();
  const [quick, setQuick] = useState(false);
  const [wished, setWished] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mn-wishlist") || "[]") as string[];
    setWished(saved.includes(product.id));
  }, [product.id]);

  const toggleWish = () => {
    const saved = JSON.parse(localStorage.getItem("mn-wishlist") || "[]") as string[];
    const next = saved.includes(product.id) ? saved.filter((id) => id !== product.id) : [...saved, product.id];
    localStorage.setItem("mn-wishlist", JSON.stringify(next));
    setWished(next.includes(product.id));
    push(next.includes(product.id) ? "Added to wishlist" : "Removed from wishlist", "info");
  };

  const add = () => {
    if (product.stock <= 0) {
      push("This piece is currently out of stock", "error");
      return;
    }
    addItem({ productId: product.id, size: product.sizes[0], color: product.colors[0], quantity: 1 });
    push(`${product.name} added to cart`);
  };

  return (
    <>
      <motion.article
        layout
        variants={cardMotion}
        initial="hidden"
        animate="show"
        exit="exit"
        whileHover={{ y: -9, boxShadow: "0 30px 90px rgba(0,0,0,0.14)" }}
        transition={{ duration: 0.34, ease: premiumEase }}
        className={cn(
          "group overflow-hidden border border-black/10 bg-white/62",
          view === "list" && "sm:grid sm:grid-cols-[260px_1fr]"
        )}
      >
        <Link href={`/products/${product.slug}`} aria-label={product.name} className="block overflow-hidden">
          <motion.div className="h-full" whileHover={{ scale: 1.045 }} transition={{ duration: 0.55, ease: premiumEase }}>
            <ProductImage product={product} className={view === "list" ? "aspect-[4/3] h-full sm:aspect-auto" : "aspect-[4/5]"} />
          </motion.div>
        </Link>
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs text-gilt">{product.category}</span>
            <span className="flex items-center gap-1 text-xs text-smoke">
              <Star className="h-3.5 w-3.5 fill-gilt text-gilt" />
              {product.rating}
            </span>
          </div>
          <Link href={`/products/${product.slug}`} className="block font-display text-2xl leading-tight text-ink">
            {product.name}
          </Link>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-smoke">{product.description}</p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{money(product.price)}</span>
                <span className="text-xs text-smoke line-through">{money(product.originalPrice)}</span>
              </div>
              <p className={product.stock > 0 ? "mt-1 text-xs text-smoke" : "mt-1 text-xs text-red-700"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                type="button"
                onClick={toggleWish}
                aria-label="Toggle wishlist"
                whileHover={{ scale: 1.08, rotate: wished ? -6 : 6 }}
                whileTap={{ scale: 0.86 }}
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-bone transition hover:bg-white"
              >
                <motion.span animate={wished ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.35 }}>
                  <Heart className={wished ? "h-4 w-4 fill-ink" : "h-4 w-4"} />
                </motion.span>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setQuick(true)}
                aria-label="Quick view"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-bone transition hover:bg-white"
              >
                <Eye className="h-4 w-4" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0.82, y: 0 }}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.88 }}
                type="button"
                onClick={add}
                aria-label="Add to cart"
                className="grid h-10 w-10 place-items-center rounded-full bg-ink text-bone transition hover:bg-coal"
              >
                <ShoppingBag className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.article>
      <AnimatePresence>{quick && <QuickViewModal product={product} onClose={() => setQuick(false)} />}</AnimatePresence>
    </>
  );
}

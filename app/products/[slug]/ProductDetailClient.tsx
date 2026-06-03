"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShieldCheck, ShoppingBag, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { money } from "@/lib/utils";
import { useCart } from "@/store/cart-store";
import { useProducts } from "@/store/product-store";
import { useToast } from "@/store/toast-store";
import { PageTransition, Reveal } from "@/components/Motion";
import { fadeUp, premiumEase, staggerContainer } from "@/lib/animations";

export function ProductDetailClient({ slug }: { slug: string }) {
  const { products } = useProducts();
  const product = products.find((item) => item.slug === slug);
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { push } = useToast();

  const related = useMemo(
    () => (product ? products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3) : []),
    [product, products]
  );

  if (!product) {
    return (
      <section className="container-pad grid min-h-[60vh] place-items-center py-12 text-center">
        <div>
          <h1 className="font-display text-5xl">Product unavailable</h1>
          <p className="mt-3 text-sm text-smoke">This product is not in the current local catalogue.</p>
          <Link href="/products" className="mt-6 inline-flex">
            <Button>Back to products</Button>
          </Link>
        </div>
      </section>
    );
  }

  const selectedSize = size || product.sizes[0];
  const selectedColor = color || product.colors[0];

  const add = () => {
    if (product.stock <= 0) {
      push("This piece is currently out of stock", "error");
      return;
    }
    addItem({ productId: product.id, size: selectedSize, color: selectedColor, quantity });
    push(`${quantity} item added to cart`);
  };

  return (
    <PageTransition className="container-pad py-12">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: premiumEase }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={imageIndex}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.015 }}
              transition={{ duration: 0.34, ease: premiumEase }}
            >
              <ProductImage product={product} imageIndex={imageIndex} className="aspect-[4/5] w-full" />
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {product.images.map((image, index) => (
              <motion.button
                key={image}
                type="button"
                onClick={() => setImageIndex(index)}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className={index === imageIndex ? "border-2 border-ink" : "border border-black/10"}
              >
                <ProductImage product={product} imageIndex={index} className="aspect-square" />
              </motion.button>
            ))}
          </div>
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="lg:sticky lg:top-28 lg:self-start">
          <motion.p variants={fadeUp} className="mb-3 text-sm text-gilt">{product.category}</motion.p>
          <motion.h1 variants={fadeUp} className="font-display text-5xl leading-tight">{product.name}</motion.h1>
          <motion.div variants={fadeUp} className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold">{money(product.price)}</span>
            <span className="text-sm text-smoke line-through">{money(product.originalPrice)}</span>
            <span className="rounded-full bg-ink px-3 py-1 text-xs text-bone">{product.discount}% off</span>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-4 flex items-center gap-2 text-sm text-smoke">
            <Star className="h-4 w-4 fill-gilt text-gilt" /> {product.rating} rating from {product.reviews} reviews
          </motion.div>
          <motion.p variants={fadeUp} className="mt-6 leading-7 text-smoke">{product.description}</motion.p>
          <motion.p variants={fadeUp} className="mt-3 text-sm text-smoke"><span className="text-ink">Fabric:</span> {product.fabric}</motion.p>

          <Selector label="Size" options={product.sizes} value={selectedSize} onChange={setSize} />
          <Selector label="Color" options={product.colors} value={selectedColor} onChange={setColor} />

          <div className="mt-7">
            <p className="mb-3 text-sm text-smoke">Quantity</p>
            <div className="inline-flex h-12 items-center overflow-hidden rounded-full border border-black/10 bg-white/70">
              <button className="grid h-12 w-12 place-items-center" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center">{quantity}</span>
              <button className="grid h-12 w-12 place-items-center" onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}><Plus className="h-4 w-4" /></button>
            </div>
          </div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={add} disabled={product.stock <= 0} className="sm:flex-1">
              <ShoppingBag className="h-4 w-4" /> {product.stock > 0 ? "Add to cart" : "Sold out"}
            </Button>
            <motion.div whileHover={{ y: -3, boxShadow: "0 20px 54px rgba(0,0,0,0.12)" }} whileTap={{ scale: 0.97 }} className="sm:flex-1">
              <Link href="/checkout" className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-black/15 px-6 text-sm">Buy now</Link>
            </motion.div>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-7 flex items-center gap-3 border border-black/10 bg-white/54 p-4 text-sm text-smoke">
            <ShieldCheck className="h-5 w-5 text-gilt" /> Cash on Delivery, easy returns and premium packaging included.
          </motion.div>
        </motion.div>
      </div>
      {related.length > 0 && (
        <Reveal className="mt-20">
          <h2 className="font-display text-4xl">Complete the rotation</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </Reveal>
      )}
    </PageTransition>
  );
}

function Selector({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <div className="mt-7">
      <p className="mb-3 text-sm text-smoke">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <motion.button key={option} whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => onChange(option)} className={value === option ? "min-h-11 rounded-full bg-ink px-5 text-sm text-bone shadow-glow" : "min-h-11 rounded-full border border-black/10 bg-white/60 px-5 text-sm"}>
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { ProductImage } from "@/components/ProductImage";
import { money } from "@/lib/utils";
import { useCart } from "@/store/cart-store";
import { useProducts } from "@/store/product-store";
import { useToast } from "@/store/toast-store";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const { products } = useProducts();
  const { push } = useToast();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState("");

  const lines = items.map((item) => ({ item, product: products.find((product) => product.id === item.productId) }));
  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + (line.product?.price ?? 0) * line.item.quantity, 0),
    [lines]
  );
  const discount = applied === "NOIR10" ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 4999 || subtotal === 0 ? 0 : 149;
  const total = subtotal - discount + shipping;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "NOIR10") {
      setApplied("NOIR10");
      push("Coupon NOIR10 applied");
    } else {
      setApplied("");
      push("Invalid coupon code", "error");
    }
  };

  return (
    <section className="container-pad py-12">
      <h1 className="font-display text-5xl">Cart</h1>
      {items.length === 0 ? (
        <div className="mt-8 grid min-h-80 place-items-center border border-black/10 bg-white/54 p-8 text-center">
          <div>
            <h2 className="font-display text-4xl">Your cart is empty</h2>
            <p className="mt-3 text-sm text-smoke">Add premium essentials to begin your order.</p>
            <Link href="/products" className="mt-6 inline-flex"><Button>Shop collection</Button></Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <AnimatePresence>
              {lines.map(({ item, product }) => (
                <motion.div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  layout
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-4 border border-black/10 bg-white/60 p-4 sm:grid-cols-[140px_1fr_auto]"
                >
                  {product ? <ProductImage product={product} className="aspect-square" /> : <div className="grid aspect-square place-items-center bg-linen text-sm">Unavailable</div>}
                  <div>
                    <h2 className="font-display text-3xl">{product?.name ?? "Unavailable product"}</h2>
                    <p className="mt-2 text-sm text-smoke">Size {item.size} / {item.color}</p>
                    <p className="mt-3 font-semibold">{money(product?.price ?? 0)}</p>
                    <button
                      type="button"
                      onClick={() => {
                        removeItem(item.productId, item.size, item.color);
                        push("Item removed", "info");
                      }}
                      className="mt-4 inline-flex items-center gap-2 text-sm text-red-700"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                  <div className="flex h-12 items-center justify-self-start overflow-hidden rounded-full border border-black/10 bg-white/70 sm:justify-self-end">
                    <button className="grid h-12 w-12 place-items-center" onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}><Minus className="h-4 w-4" /></button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <button className="grid h-12 w-12 place-items-center" onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}><Plus className="h-4 w-4" /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <aside className="h-fit border border-black/10 bg-ink p-6 text-bone lg:sticky lg:top-28">
            <h2 className="font-display text-3xl">Order summary</h2>
            <div className="mt-6 flex gap-2">
              <input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="NOIR10" className="focus-ring h-12 min-w-0 flex-1 rounded-full border border-white/10 bg-white/10 px-4 text-bone placeholder:text-bone/45" />
              <button onClick={applyCoupon} className="h-12 rounded-full bg-bone px-5 text-sm text-ink">Apply</button>
            </div>
            <SummaryRow label="Subtotal" value={money(subtotal)} />
            <SummaryRow label="Discount" value={`-${money(discount)}`} />
            <SummaryRow label="Shipping" value={shipping === 0 ? "Free" : money(shipping)} />
            <div className="mt-5 flex justify-between border-t border-white/10 pt-5 text-lg">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
            <Link href="/checkout" className="mt-6 flex"><Button variant="light" className="w-full">Proceed to checkout</Button></Link>
          </aside>
        </div>
      )}
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-5 flex justify-between text-sm text-bone/72">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

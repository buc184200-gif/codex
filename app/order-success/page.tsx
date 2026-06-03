"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Suspense } from "react";
import { Button } from "@/components/Button";
import { money } from "@/lib/utils";
import { useOrders } from "@/store/order-store";
import { useProducts } from "@/store/product-store";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<section className="container-pad py-16">Loading order...</section>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const params = useSearchParams();
  const { orders } = useOrders();
  const { products } = useProducts();
  const id = params.get("orderId");
  const order = orders.find((item) => item.id === id);

  return (
    <section className="container-pad py-16">
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-3xl border border-black/10 bg-white/64 p-8 text-center shadow-soft">
        <CheckCircle2 className="mx-auto h-14 w-14 text-gilt" />
        <h1 className="mt-5 font-display text-5xl">Order confirmed</h1>
        <p className="mt-3 text-sm text-smoke">Your Cash on Delivery order has been saved locally.</p>
        <div className="mt-8 bg-ink p-5 text-left text-bone">
          <p className="text-sm text-bone/65">Order ID</p>
          <p className="mt-1 font-display text-3xl">{id ?? "Not found"}</p>
          {order ? (
            <>
              <div className="mt-6 space-y-3">
                {order.items.map((item) => {
                  const product = products.find((entry) => entry.id === item.productId);
                  return (
                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between gap-4 text-sm text-bone/72">
                      <span>{product?.name ?? "Product"} × {item.quantity}</span>
                      <span>{money((product?.price ?? 0) * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 flex justify-between border-t border-white/10 pt-5 text-lg">
                <span>Total</span>
                <span>{money(order.total)}</span>
              </div>
            </>
          ) : (
            <p className="mt-5 text-sm text-bone/72">Open Admin to view saved orders from this browser.</p>
          )}
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/products"><Button>Continue shopping</Button></Link>
          <Link href="/admin" className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/15 px-6 text-sm">View in admin</Link>
        </div>
      </motion.div>
    </section>
  );
}

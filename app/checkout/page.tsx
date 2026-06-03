"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { money, orderId } from "@/lib/utils";
import { useCart } from "@/store/cart-store";
import { useOrders } from "@/store/order-store";
import { useProducts } from "@/store/product-store";
import { useToast } from "@/store/toast-store";
import { Customer } from "@/types";

const emptyCustomer: Customer = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: ""
};

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { products } = useProducts();
  const { createOrder } = useOrders();
  const { push } = useToast();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (products.find((product) => product.id === item.productId)?.price ?? 0) * item.quantity, 0),
    [items, products]
  );
  const shipping = subtotal > 4999 || subtotal === 0 ? 0 : 149;
  const total = subtotal + shipping;

  const setField = (field: keyof Customer, value: string) => setCustomer((current) => ({ ...current, [field]: value }));

  const validate = () => {
    const next: Partial<Record<keyof Customer, string>> = {};
    if (customer.name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) next.email = "Enter a valid email.";
    if (!/^[0-9]{10}$/.test(customer.phone)) next.phone = "Enter a 10-digit mobile number.";
    if (customer.address.trim().length < 8) next.address = "Enter a complete address.";
    if (!customer.city.trim()) next.city = "City is required.";
    if (!customer.state.trim()) next.state = "State is required.";
    if (!/^[0-9]{6}$/.test(customer.pincode)) next.pincode = "Enter a 6-digit PIN code.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (items.length === 0) {
      push("Your cart is empty", "error");
      router.push("/products");
      return;
    }
    if (!validate()) {
      push("Please fix checkout details", "error");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      const id = orderId();
      createOrder({
        id,
        items,
        customer,
        subtotal,
        discount: 0,
        shipping,
        total,
        status: "Pending",
        payment: "Cash on Delivery",
        createdAt: new Date().toISOString()
      });
      clearCart();
      push("Order placed successfully");
      router.push(`/order-success?orderId=${id}`);
    }, 650);
  };

  return (
    <section className="container-pad py-12">
      <h1 className="font-display text-5xl">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="border border-black/10 bg-white/60 p-5 md:p-8"
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-bone">1</span>
            <h2 className="font-display text-3xl">Delivery details</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name" value={customer.name} onChange={(value) => setField("name", value)} error={errors.name} />
            <Field label="Email" type="email" value={customer.email} onChange={(value) => setField("email", value)} error={errors.email} />
            <Field label="Phone" value={customer.phone} onChange={(value) => setField("phone", value)} error={errors.phone} />
            <Field label="PIN code" value={customer.pincode} onChange={(value) => setField("pincode", value)} error={errors.pincode} />
            <Field label="City" value={customer.city} onChange={(value) => setField("city", value)} error={errors.city} />
            <Field label="State" value={customer.state} onChange={(value) => setField("state", value)} error={errors.state} />
            <Field label="Address" value={customer.address} onChange={(value) => setField("address", value)} error={errors.address} wide />
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.4 }} className="mt-8 border border-black/10 bg-bone p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-gilt" />
              <h2 className="font-display text-2xl">Payment</h2>
            </div>
            <p className="mt-2 text-sm text-smoke">Cash on Delivery is selected for every order.</p>
          </motion.div>
          <Button type="submit" disabled={loading} className="mt-8 w-full">
            {loading ? "Placing order..." : "Place COD order"}
          </Button>
        </motion.form>
        <aside className="h-fit border border-black/10 bg-ink p-6 text-bone lg:sticky lg:top-28">
          <h2 className="font-display text-3xl">Summary</h2>
          <div className="mt-5 space-y-4">
            {items.map((item) => {
              const product = products.find((entry) => entry.id === item.productId);
              return (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between gap-4 text-sm text-bone/72">
                  <span>{product?.name ?? "Unavailable"} × {item.quantity}</span>
                  <span>{money((product?.price ?? 0) * item.quantity)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex justify-between border-t border-white/10 pt-5 text-sm text-bone/72"><span>Shipping</span><span>{shipping === 0 ? "Free" : money(shipping)}</span></div>
          <div className="mt-5 flex justify-between text-xl"><span>Total</span><span>{money(total)}</span></div>
        </aside>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, error, type = "text", wide = false }: { label: string; value: string; onChange: (value: string) => void; error?: string; type?: string; wide?: boolean }) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="text-sm text-smoke">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring mt-2 h-12 w-full rounded-full border border-black/10 bg-white/75 px-4" />
      {error && <span className="mt-1 block text-xs text-red-700">{error}</span>}
    </label>
  );
}

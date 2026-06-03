"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Package, Plus, RotateCcw, Save, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/Button";
import { ProductImage } from "@/components/ProductImage";
import { money } from "@/lib/utils";
import { products as seedProducts } from "@/data/products";
import { useOrders } from "@/store/order-store";
import { useProducts } from "@/store/product-store";
import { useToast } from "@/store/toast-store";
import { OrderStatus, Product, ProductCategory } from "@/types";

const statuses: OrderStatus[] = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const blankProduct = (): Product => ({
  ...seedProducts[0],
  id: `prd-${crypto.randomUUID().slice(0, 8)}`,
  slug: "",
  name: "",
  price: 2999,
  originalPrice: 3999,
  discount: 20,
  images: ["front", "back", "fabric"],
  sizes: ["S", "M", "L", "XL"],
  colors: ["Black"],
  category: "T-Shirts",
  stock: 10,
  description: "",
  fabric: "Premium cotton",
  rating: 4.7,
  reviews: 0,
  popularity: 50,
  createdAt: new Date().toISOString().slice(0, 10),
  tone: "#111111",
  accent: "#c7aa73",
  shape: "tee"
});

export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useProducts();
  const { orders, updateStatus } = useOrders();
  const { push } = useToast();
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [draft, setDraft] = useState<Product>(blankProduct());
  const [editing, setEditing] = useState(false);

  const revenue = orders.filter((order) => order.status !== "Cancelled").reduce((sum, order) => sum + order.total, 0);
  const pending = orders.filter((order) => order.status === "Pending").length;

  const stats = [
    { label: "Total orders", value: orders.length, icon: ShoppingBag },
    { label: "Revenue", value: money(revenue), icon: Truck },
    { label: "Pending orders", value: pending, icon: Package },
    { label: "Total products", value: products.length, icon: Package }
  ];

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.description.trim()) {
      push("Product name and description are required", "error");
      return;
    }
    const clean = {
      ...draft,
      slug: draft.slug || draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      discount: Math.max(0, Math.round(((draft.originalPrice - draft.price) / draft.originalPrice) * 100)),
      sizes: draft.sizes.filter(Boolean),
      colors: draft.colors.filter(Boolean)
    };
    if (editing) {
      updateProduct(clean);
      push("Product updated");
    } else {
      addProduct(clean);
      push("Product added");
    }
    setDraft(blankProduct());
    setEditing(false);
  };

  const edit = (product: Product) => {
    setDraft(product);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="container-pad py-12">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-sm text-gilt">Admin</p>
          <h1 className="font-display text-5xl">Dashboard</h1>
        </div>
        <div className="inline-flex rounded-full border border-black/10 bg-white/70 p-1">
          <button onClick={() => setTab("products")} className={tab === "products" ? "rounded-full bg-ink px-5 py-2 text-sm text-bone" : "px-5 py-2 text-sm"}>Products</button>
          <button onClick={() => setTab("orders")} className={tab === "orders" ? "rounded-full bg-ink px-5 py-2 text-sm text-bone" : "px-5 py-2 text-sm"}>Orders</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="border border-black/10 bg-white/62 p-5"
          >
            <stat.icon className="mb-4 h-5 w-5 text-gilt" />
            <p className="text-sm text-smoke">{stat.label}</p>
            <p className="mt-2 font-display text-3xl">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {tab === "products" ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
          <form onSubmit={submit} className="h-fit border border-black/10 bg-ink p-6 text-bone lg:sticky lg:top-28">
            <h2 className="font-display text-3xl">{editing ? "Edit product" : "Add product"}</h2>
            <AdminField label="Name" value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} />
            <AdminField label="Slug" value={draft.slug} onChange={(value) => setDraft({ ...draft, slug: value })} placeholder="Auto-generated if blank" />
            <div className="grid grid-cols-2 gap-3">
              <AdminField label="Price" type="number" value={String(draft.price)} onChange={(value) => setDraft({ ...draft, price: Number(value) })} />
              <AdminField label="Original" type="number" value={String(draft.originalPrice)} onChange={(value) => setDraft({ ...draft, originalPrice: Number(value) })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AdminField label="Stock" type="number" value={String(draft.stock)} onChange={(value) => setDraft({ ...draft, stock: Number(value) })} />
              <AdminField label="Popularity" type="number" value={String(draft.popularity)} onChange={(value) => setDraft({ ...draft, popularity: Number(value) })} />
            </div>
            <label className="mt-4 block">
              <span className="text-sm text-bone/72">Category</span>
              <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as ProductCategory })} className="focus-ring mt-2 h-11 w-full rounded-full border border-white/10 bg-white/10 px-4">
                <option>T-Shirts</option>
                <option>Shirts</option>
                <option>Overshirts</option>
              </select>
            </label>
            <AdminField label="Sizes" value={draft.sizes.join(", ")} onChange={(value) => setDraft({ ...draft, sizes: value.split(",").map((item) => item.trim()) })} />
            <AdminField label="Colors" value={draft.colors.join(", ")} onChange={(value) => setDraft({ ...draft, colors: value.split(",").map((item) => item.trim()) })} />
            <AdminField label="Fabric" value={draft.fabric} onChange={(value) => setDraft({ ...draft, fabric: value })} />
            <label className="mt-4 block">
              <span className="text-sm text-bone/72">Description</span>
              <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="focus-ring mt-2 min-h-24 w-full rounded-3xl border border-white/10 bg-white/10 px-4 py-3" />
            </label>
            <div className="mt-5 flex gap-3">
              <Button type="submit" variant="light" className="flex-1">{editing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{editing ? "Save" : "Add"}</Button>
              <button type="button" onClick={() => { setDraft(blankProduct()); setEditing(false); }} className="grid h-12 w-12 place-items-center rounded-full border border-white/15"><RotateCcw className="h-4 w-4" /></button>
            </div>
            <button type="button" onClick={() => { resetProducts(); push("Seed products restored", "info"); }} className="mt-4 text-sm text-sand">Restore default catalogue</button>
          </form>
          <div className="grid gap-4">
            {products.map((product) => (
              <motion.div key={product.id} layout className="grid gap-4 border border-black/10 bg-white/62 p-4 sm:grid-cols-[120px_1fr_auto]">
                <ProductImage product={product} className="aspect-square" />
                <div>
                  <h3 className="font-display text-3xl">{product.name}</h3>
                  <p className="mt-2 text-sm text-smoke">{product.category} / {product.stock} in stock / {money(product.price)}</p>
                  <p className="mt-2 text-sm leading-6 text-smoke">{product.description}</p>
                </div>
                <div className="flex gap-2 sm:flex-col">
                  <button onClick={() => edit(product)} className="grid h-10 w-10 place-items-center rounded-full border border-black/10"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => { deleteProduct(product.id); push("Product deleted", "info"); }} className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-red-700"><Trash2 className="h-4 w-4" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <OrdersTable orders={orders} updateStatus={updateStatus} />
      )}
    </section>
  );
}

function AdminField({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="mt-4 block">
      <span className="text-sm text-bone/72">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="focus-ring mt-2 h-11 w-full rounded-full border border-white/10 bg-white/10 px-4 text-bone placeholder:text-bone/35" />
    </label>
  );
}

function OrdersTable({ orders, updateStatus }: { orders: ReturnType<typeof useOrders>["orders"]; updateStatus: ReturnType<typeof useOrders>["updateStatus"] }) {
  const sorted = useMemo(() => [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)), [orders]);
  if (orders.length === 0) {
    return (
      <div className="mt-8 grid min-h-72 place-items-center border border-black/10 bg-white/60 p-8 text-center">
        <div>
          <h2 className="font-display text-4xl">No orders yet</h2>
          <p className="mt-2 text-sm text-smoke">Completed checkout orders will appear here.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-8 overflow-x-auto border border-black/10 bg-white/62">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-ink text-bone">
          <tr>
            <th className="p-4">Order</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Items</th>
            <th className="p-4">Total</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((order) => (
            <tr key={order.id} className="border-t border-black/10">
              <td className="p-4">
                <p className="font-semibold">{order.id}</p>
                <p className="mt-1 text-xs text-smoke">{new Date(order.createdAt).toLocaleString()}</p>
              </td>
              <td className="p-4">
                <p>{order.customer.name}</p>
                <p className="mt-1 text-xs text-smoke">{order.customer.phone}</p>
              </td>
              <td className="p-4">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
              <td className="p-4">{money(order.total)}</td>
              <td className="p-4">
                <select value={order.status} onChange={(event) => updateStatus(order.id, event.target.value as OrderStatus)} className="focus-ring h-10 rounded-full border border-black/10 bg-bone px-3">
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

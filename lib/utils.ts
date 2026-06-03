import { Product } from "@/types";

export const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const orderId = () => {
  const date = new Date();
  const stamp = date.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `MN-${stamp}-${suffix}`;
};

export const productMatches = (product: Product, query: string) => {
  const value = query.trim().toLowerCase();
  if (!value) return true;
  return [product.name, product.category, product.description, product.fabric]
    .join(" ")
    .toLowerCase()
    .includes(value);
};

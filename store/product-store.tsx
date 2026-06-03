"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { products as seedProducts } from "@/data/products";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { Product } from "@/types";

type ProductContextValue = {
  products: Product[];
  ready: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
};

const ProductContext = createContext<ProductContextValue | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts, ready] = useLocalStorageState<Product[]>("mn-products", seedProducts);

  const value = useMemo<ProductContextValue>(
    () => ({
      products,
      ready,
      addProduct: (product) => setProducts((items) => [product, ...items]),
      updateProduct: (product) => setProducts((items) => items.map((item) => (item.id === product.id ? product : item))),
      deleteProduct: (id) => setProducts((items) => items.filter((item) => item.id !== id)),
      resetProducts: () => setProducts(seedProducts)
    }),
    [products, ready, setProducts]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used inside ProductProvider");
  return context;
};

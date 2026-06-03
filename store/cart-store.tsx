"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { CartItem } from "@/types";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  clearCart: () => void;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorageState<CartItem[]>("mn-cart", []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem: (item) =>
        setItems((current) => {
          const found = current.find(
            (entry) => entry.productId === item.productId && entry.size === item.size && entry.color === item.color
          );
          if (!found) return [...current, item];
          return current.map((entry) =>
            entry === found ? { ...entry, quantity: Math.min(entry.quantity + item.quantity, 20) } : entry
          );
        }),
      updateQuantity: (productId, size, color, quantity) =>
        setItems((current) =>
          current.map((item) =>
            item.productId === productId && item.size === size && item.color === color
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          )
        ),
      removeItem: (productId, size, color) =>
        setItems((current) =>
          current.filter((item) => !(item.productId === productId && item.size === size && item.color === color))
        ),
      clearCart: () => setItems([]),
      count: items.reduce((sum, item) => sum + item.quantity, 0)
    }),
    [items, setItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};

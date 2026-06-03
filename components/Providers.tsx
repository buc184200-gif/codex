"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/store/cart-store";
import { OrderProvider } from "@/store/order-store";
import { ProductProvider } from "@/store/product-store";
import { ToastProvider } from "@/store/toast-store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>{children}</OrderProvider>
        </CartProvider>
      </ProductProvider>
    </ToastProvider>
  );
}

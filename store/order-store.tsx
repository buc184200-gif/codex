"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { Order, OrderStatus } from "@/types";

type OrderContextValue = {
  orders: Order[];
  createOrder: (order: Order) => void;
  updateStatus: (id: string, status: OrderStatus) => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useLocalStorageState<Order[]>("mn-orders", []);

  const value = useMemo<OrderContextValue>(
    () => ({
      orders,
      createOrder: (order) => setOrders((items) => [order, ...items]),
      updateStatus: (id, status) =>
        setOrders((items) => items.map((order) => (order.id === id ? { ...order, status } : order)))
    }),
    [orders, setOrders]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used inside OrderProvider");
  return context;
};

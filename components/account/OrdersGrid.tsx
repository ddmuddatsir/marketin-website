"use client";

import { OrderCard } from "./OrderCard";
import { Product } from "@/types/product";

interface OrdersGridProps {
  orders: Array<{
    id: string;
    orderId: string;
    orderStatus: string;
    orderDate: { _seconds: number; _nanoseconds: number } | string | Date;
    name?: string;
    productId?: string;
    productData?: Product;
    quantity: number;
    price: number;
    uniqueId: string;
  }>;
}

export function OrdersGrid({ orders }: OrdersGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((item, index) => {
        // Use the pre-generated uniqueId or fallback to a constructed one
        const key =
          item.uniqueId ||
          `${item.orderId || "no-order"}-${item.id || "no-id"}-${
            item.productId || "no-product"
          }-${index}`;
        return <OrderCard key={key} item={item} />;
      })}
    </div>
  );
}

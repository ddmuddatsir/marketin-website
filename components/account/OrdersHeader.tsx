"use client";

import { PageHeader } from "@/components/ui/PageHeader";

interface OrdersHeaderProps {
  totalOrders: number;
}

export function OrdersHeader({ totalOrders }: OrdersHeaderProps) {
  return (
    <PageHeader
      title="Order History"
      subtitle={
        totalOrders > 0
          ? `${totalOrders} ${totalOrders === 1 ? "order" : "orders"} found`
          : undefined
      }
      actions={
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Download History
        </button>
      }
    />
  );
}

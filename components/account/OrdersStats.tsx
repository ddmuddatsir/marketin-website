"use client";

import { Order } from "@/types/order";

interface OrdersStatsProps {
  orders: Order[];
  totalItems: number;
}

export function OrdersStats({ orders, totalItems }: OrdersStatsProps) {
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.total || order.totalAmount || 0),
    0
  );

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
          <p className="text-sm text-gray-600">Total Items</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">
            ${totalSpent.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Total Spent</p>
        </div>
      </div>
    </div>
  );
}

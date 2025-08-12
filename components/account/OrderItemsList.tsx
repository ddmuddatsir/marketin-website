"use client";

import Image from "next/image";
import { OrderDetail, OrderItem } from "@/types/order";

interface OrderItemsListProps {
  order: OrderDetail;
}

export function OrderItemsList({ order }: OrderItemsListProps) {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Order Items
        </h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <OrderItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface OrderItemCardProps {
  item: OrderItem;
}

function OrderItemCard({ item }: OrderItemCardProps) {
  return (
    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
      <div className="w-20 h-20 flex-shrink-0">
        {item.productData?.thumbnail ? (
          <Image
            src={item.productData.thumbnail}
            alt={item.productData.title || item.name}
            width={80}
            height={80}
            className="w-full h-full object-cover rounded-md"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">
          {item.productData?.title || item.name || `Product #${item.productId}`}
        </h3>
        {item.productData?.brand && (
          <p className="text-sm text-gray-600">{item.productData.brand}</p>
        )}
        {item.productData?.category && (
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {item.productData.category}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
          <span className="font-semibold text-gray-900">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

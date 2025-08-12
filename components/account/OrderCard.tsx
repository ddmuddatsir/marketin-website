"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product";

interface OrderCardProps {
  item: {
    id: string;
    orderId: string;
    orderStatus: string;
    orderDate: { _seconds: number; _nanoseconds: number } | string | Date;
    name?: string;
    productId?: string;
    productData?: Product;
    quantity: number;
    price: number;
    uniqueId?: string; // Optional since existing components might not have it
  };
}

export function OrderCard({ item }: OrderCardProps) {
  const router = useRouter();

  const formatDate = (
    date: { _seconds: number; _nanoseconds: number } | string | Date
  ) => {
    if (typeof date === "object" && "_seconds" in date) {
      return new Date(
        date._seconds * 1000 + date._nanoseconds / 1000000
      ).toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow">
      {/* Order Info Header */}
      <div className="mb-4 pb-3 border-b border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 font-medium">
            Order #{item.orderId.slice(-8)}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              item.orderStatus
            )}`}
          >
            {item.orderStatus || "pending"}
          </span>
        </div>
        <p className="text-xs text-gray-500">{formatDate(item.orderDate)}</p>
      </div>

      {/* Product Section */}
      <div className="flex space-x-3">
        {/* Product Image */}
        <div className="w-20 h-20 flex-shrink-0">
          {item.productData?.thumbnail ? (
            <Image
              src={item.productData.thumbnail}
              alt={item.productData.title || item.name || "Product"}
              width={80}
              height={80}
              className="w-full h-full object-cover rounded-md"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const placeholder = target.parentElement?.querySelector(
                  ".placeholder"
                ) as HTMLElement;
                if (placeholder) {
                  placeholder.style.display = "flex";
                }
              }}
            />
          ) : null}
          <div
            className={`placeholder w-full h-full bg-gray-200 rounded-md flex items-center justify-center ${
              item.productData?.thumbnail ? "hidden" : "flex"
            }`}
          >
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-base text-gray-900 line-clamp-2">
            {item.name ||
              item.productData?.title ||
              `Product #${item.productId || item.id}`}
          </h3>

          {item.productData?.brand && (
            <p className="text-sm text-gray-600 font-medium">
              {item.productData.brand}
            </p>
          )}

          {item.productData?.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {item.productData.category}
            </p>
          )}
        </div>
      </div>

      {/* Quantity and Price */}
      <div className="flex justify-between items-center mt-4 mb-4">
        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
        <div className="text-right">
          <p className="font-bold text-lg text-gray-900">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            ${item.price?.toFixed(2)} each
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => router.push(`/account/orders/${item.orderId}`)}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
        >
          View Details
        </button>
        <button
          onClick={() => router.push(`/products/${item.productId}`)}
          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-xs font-medium"
        >
          Buy Again
        </button>
      </div>
    </div>
  );
}

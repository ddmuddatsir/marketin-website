"use client";
import { useRouter } from "next/navigation";

export function OrderDetailActions() {
  const router = useRouter();

  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-4">
      <button
        onClick={() => router.push("/account/orders")}
        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Back to Orders
      </button>
      <button
        onClick={() => router.push("/products")}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );
}

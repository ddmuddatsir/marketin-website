"use client";

import { useRouter } from "next/navigation";

export function OrdersEmptyState() {
  const router = useRouter();

  return (
    <div className="p-8 text-center">
      <div className="text-gray-500 mb-4">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
      <p className="text-gray-500">You haven&apos;t placed any orders yet.</p>
      <div className="mt-6">
        <button
          onClick={() => router.push("/products")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
}

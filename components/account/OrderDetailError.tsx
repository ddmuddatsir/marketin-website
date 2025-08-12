"use client";
import { useRouter } from "next/navigation";
import { AccountLayout } from "./AccountLayout";

interface OrderDetailErrorProps {
  error: string;
}

export function OrderDetailError({ error }: OrderDetailErrorProps) {
  const router = useRouter();

  return (
    <AccountLayout>
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg
            className="mx-auto h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t find the order you&apos;re looking for.
        </p>
        <button
          onClick={() => router.push("/account/orders")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Orders
        </button>
      </div>
    </AccountLayout>
  );
}

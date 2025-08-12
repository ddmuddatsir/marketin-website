"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { InfoCard, SummaryItem, InfoItem } from "@/components/ui/InfoCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface OrderData {
  id: string;
  status: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams?.get("orderId");
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  // Mock order data - replace with actual API call
  useEffect(() => {
    if (orderId) {
      // Simulate API call
      setOrderData({
        id: orderId,
        status: "completed",
        total: 299.99,
        items: [
          { name: "Product 1", quantity: 2, price: 99.99 },
          { name: "Product 2", quantity: 1, price: 99.99 },
        ],
        paymentMethod: "Credit Card",
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          postalCode: "10001",
        },
      });
    }
  }, [orderId]);

  // Loading state
  if (!orderData && orderId) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg">Loading order details...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <PageHeader
          title="Order Confirmed!"
          subtitle={`Order #${orderId?.slice(-8) || "N/A"}`}
          status={{
            label: "Confirmed",
            color: "green",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <InfoCard title="Order Summary">
            <div className="space-y-2">
              <SummaryItem
                label="Subtotal"
                value={`$${orderData?.total?.toFixed(2) || "0.00"}`}
              />
              <SummaryItem label="Shipping" value="Free" />
              <SummaryItem label="Tax" value="$24.00" />
              <SummaryItem
                label="Total"
                value={`$${((orderData?.total || 0) + 24).toFixed(2)}`}
                isTotal={true}
              />
            </div>
          </InfoCard>

          {/* Order Details */}
          <InfoCard title="Order Details">
            <div className="space-y-3">
              <InfoItem
                label="Order Status"
                value={
                  <StatusBadge
                    status={orderData?.status || "pending"}
                    color="green"
                  />
                }
              />
              <InfoItem
                label="Payment Method"
                value={orderData?.paymentMethod || "N/A"}
              />
              <InfoItem label="Estimated Delivery" value="3-5 business days" />
            </div>
          </InfoCard>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push("/account/orders")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View All Orders
          </button>
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

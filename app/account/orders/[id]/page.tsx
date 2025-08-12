"use client";
import { useParams } from "next/navigation";
import { AccountLayout } from "@/components/account/AccountLayout";
import { OrderDetailLoading } from "@/components/account/OrderDetailLoading";
import { OrderDetailError } from "@/components/account/OrderDetailError";
import { OrderDetailContent } from "@/components/account/OrderDetailContent";
import { useOrderDetail } from "@/hooks/useOrderDetail";

// Disable static generation for auth-required pages
export const dynamic = "force-dynamic";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { order, loading, error } = useOrderDetail(orderId);

  if (loading) {
    return <OrderDetailLoading />;
  }

  if (error) {
    return <OrderDetailError error={error} />;
  }

  if (!order) {
    return <OrderDetailError error="Order not found" />;
  }

  return (
    <AccountLayout>
      <OrderDetailContent order={order} />
    </AccountLayout>
  );
}

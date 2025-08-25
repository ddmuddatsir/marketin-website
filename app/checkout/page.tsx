"use client";
import { Suspense } from "react";
import { AuthGuard } from "@/components/checkout/AuthGuard";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";
import { CheckoutSuspenseLoading } from "@/components/checkout/CheckoutLoading";

// Disable static generation for checkout page
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<CheckoutSuspenseLoading />}>
        <CheckoutContent />
      </Suspense>
    </AuthGuard>
  );
}

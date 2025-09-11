"use client";

import Cart from "@/components/cart/Cart";

// CSR - Client-side rendering for dynamic cart data
export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <main className="max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">
            Review and manage items in your cart
          </p>
        </div>

        <Cart />
      </div>
    </main>
  );
}

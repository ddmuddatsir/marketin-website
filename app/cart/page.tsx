"use client";
import Cart from "@/components/cart/Cart";

// Disable static generation for cart page
export const dynamic = "force-dynamic";

export default function CartPage() {
  return <Cart />;
}

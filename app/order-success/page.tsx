"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";

// Disable static generation for order success page
export const dynamic = "force-dynamic";

export default function OrderSuccessPage() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/account/orders");
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <FaCheckCircle className="text-green-500 animate-bounce mb-4" size={80} />
      <h1 className="text-2xl font-bold mb-2 text-green-700">
        Order Placed Successfully!
      </h1>
      <p className="text-gray-600">Redirecting to your account...</p>
    </div>
  );
}

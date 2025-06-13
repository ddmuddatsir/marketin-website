"use client";

import React, { use } from "react";
import ReviewProduct from "@/components/productId/ReviewProduct";
import RelatedProduct from "@/components/productId/RelatedProduct";
import DetailProduct from "@/components/productId/DetailProduct";
import { useProduct } from "@/hooks/useProduct";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading || !product) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load product details.
      </div>
    );
  }

  const handleBuyNow = () => {
    // Arahkan ke halaman checkout atau tambahkan ke cart
  };

  const handleWishlist = () => {
    // Kirim ke API atau update state wishlist
  };

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-12">
      {/* Detail */}
      <DetailProduct product={product} />

      {/* Reviews */}
      <ReviewProduct reviews={product.reviews} />

      {/* Related Products */}
      <RelatedProduct category={product.category} excludeId={product.id} />
    </main>
  );
}

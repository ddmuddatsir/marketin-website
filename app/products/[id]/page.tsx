"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReviewProduct from "@/components/productId/ReviewProduct";
import RelatedProduct from "@/components/productId/RelatedProduct";
import DetailProduct from "@/components/productId/DetailProduct";
import { useProduct } from "@/hooks/useProduct";
import { Skeleton } from "@/components/ui/skeleton";

// Disable static generation for product detail page
export const dynamic = "force-dynamic";
import { ProductId } from "@/types/productId";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { data: product, isLoading, error } = useProduct(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-12">
        <div className="flex flex-col md:flex-row gap-10">
          <Skeleton className="md:w-1/2 aspect-square" />
          <div className="md:w-1/2 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    // If the error is a 404 (product not found), trigger Next.js not-found page
    const isAxiosError =
      error && typeof error === "object" && "response" in error;
    if (
      error &&
      ((isAxiosError &&
        (error as { response: { status: number } }).response?.status === 404) ||
        error?.message?.includes("404") ||
        error?.message?.includes("Not Found"))
    ) {
      notFound();
    }

    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p className="text-muted-foreground">
            Failed to load product details. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">{product.title}</li>
        </ol>
      </nav>

      {/* Product Detail */}
      <DetailProduct product={product as ProductId} />

      {/* Reviews */}
      <ReviewProduct reviews={product.reviews} />

      {/* Related Products */}
      {product.category && (
        <RelatedProduct
          category={product.category}
          excludeId={
            typeof product.id === "string" ? parseInt(product.id) : product.id
          }
        />
      )}
    </main>
  );
}

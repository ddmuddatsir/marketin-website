import InfiniteProductScroll from "@/components/products/InfiniteProductScroll";
import { Suspense } from "react";

// ISR - Revalidate every hour for product listings
export const revalidate = 3600;

function ProductsLoading() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export default async function ProductsPage() {
  return (
    <main className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="text-muted-foreground">
          Discover our complete collection of products
        </p>
      </div>

      <Suspense fallback={<ProductsLoading />}>
        <InfiniteProductScroll />
      </Suspense>
    </main>
  );
}

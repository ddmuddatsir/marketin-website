"use client";

import { useParams } from "next/navigation";
import { useProductCategory } from "@/hooks/useProduct";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";

// Disable static generation for category page
export const dynamic = "force-dynamic";

export default function CategoryPage() {
  const params = useParams();
  const category = params?.category as string;

  const { data, isLoading, isError, error } = useProductCategory(category);

  // Extract products array from the response
  const products = data?.products || [];

  // Debug logging
  console.log("Category page debug:", {
    category,
    data,
    products,
    isLoading,
    isError,
    error,
    productsLength: products.length,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load products: {error?.message}</p>;

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {category.replace("-", " ")}
      </h1>

      {!Array.isArray(products) || products.length === 0 ? (
        <p className="text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              showDescription={false}
              showRating={true}
              showAddToCart={false}
              showWishlist={false}
            />
          ))}
        </div>
      )}
    </main>
  );
}

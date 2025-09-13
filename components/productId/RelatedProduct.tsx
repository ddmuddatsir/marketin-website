"use client";

import { useProductCategory } from "@/hooks/useProduct";
import React from "react";
import { ProductCard } from "@/components/products/ProductCard";

interface RelatedProductProps {
  category: string;
  excludeId: number;
}

const RelatedProduct: React.FC<RelatedProductProps> = ({
  category,
  excludeId,
}) => {
  const { data, isLoading, error } = useProductCategory(category, excludeId);

  if (isLoading || !category) {
    return (
      <div>
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse"
              >
                {/* Image skeleton */}
                <div className="aspect-square bg-gray-200"></div>
                {/* Content skeleton */}
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-10"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load related products.
      </div>
    );
  }

  const products = data?.products ?? [];

  if (products.length === 0) {
    return null;
  }

  return (
    <div>
      <section>
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 6).map((product) => (
            <div key={product.id}>
              <ProductCard
                product={product}
                showDescription={false}
                showRating={true}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RelatedProduct;

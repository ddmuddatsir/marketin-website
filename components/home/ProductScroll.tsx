"use client";

import { fetchAllProducts } from "@/lib/api/product";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useCallback, useRef } from "react";
import { ProductCard } from "@/components/products/ProductCard";

const ProductScroll = () => {
  const observer = useRef<IntersectionObserver | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["all-products"],
      queryFn: ({ pageParam }) => fetchAllProducts({ pageParam }),
      getNextPageParam: (lastPage) => lastPage.nextSkip,
      initialPageParam: 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allProducts.map((product, i) => {
          const isLast = i === allProducts.length - 1;
          return (
            <div key={product.id} ref={isLast ? lastProductRef : null}>
              <ProductCard
                product={product}
                showDescription={false}
                showRating={true}
              />
            </div>
          );
        })}
      </div>
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      {!hasNextPage && allProducts.length > 0 && (
        <div className="text-center mt-6 text-gray-500">
          No more products to load.
        </div>
      )}
    </div>
  );
};

export default ProductScroll;

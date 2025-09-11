"use client";

import { fetchAllProducts } from "@/lib/api/product";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useCallback, useRef, useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { useRouter } from "next/navigation";

const ProductScroll = () => {
  const observer = useRef<IntersectionObserver | null>(null);
  const router = useRouter();
  const [scrollCount, setScrollCount] = useState(0);
  const MAX_SCROLLS = 2;

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
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          scrollCount < MAX_SCROLLS
        ) {
          fetchNextPage();
          setScrollCount((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage, scrollCount]
  );

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-6">All Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-lg overflow-hidden border border-gray-200 animate-pulse"
            >
              {/* Image skeleton */}
              <div className="aspect-square bg-gray-300"></div>

              {/* Content skeleton */}
              <div className="p-4 space-y-3">
                {/* Title skeleton */}
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>

                {/* Rating skeleton */}
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-10"></div>
                </div>

                {/* Price skeleton */}
                <div className="h-5 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allProducts.map((product, i) => {
          const isLast = i === allProducts.length - 1;
          const shouldShowRef = isLast && scrollCount < MAX_SCROLLS;
          return (
            <div key={product.id} ref={shouldShowRef ? lastProductRef : null}>
              <ProductCard
                product={product}
                showDescription={false}
                showRating={true}
              />
            </div>
          );
        })}
      </div>

      {/* Loading indicator */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* See All Products button - show when scroll limit reached or no more pages */}
      {(scrollCount >= MAX_SCROLLS || !hasNextPage) &&
        allProducts.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => router.push("/products")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              See All Products
            </button>
            <p className="text-gray-500 text-sm mt-2">
              View all products in our catalog
            </p>
          </div>
        )}
    </div>
  );
};

export default ProductScroll;

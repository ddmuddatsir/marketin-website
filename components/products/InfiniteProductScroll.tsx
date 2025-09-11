"use client";

import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { ProductsResponse } from "@/types/product";

const LIMIT = 12;

async function fetchProducts({ pageParam = 1, searchQuery = "" }) {
  try {
    const params = new URLSearchParams({
      page: pageParam.toString(),
      limit: LIMIT.toString(),
    });

    // Add search query if provided
    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }

    const { data } = await axios.get<ProductsResponse>(
      `/api/products?${params.toString()}`
    );

    return {
      products: data.products,
      total: data.total,
      skip: data.skip,
      limit: data.limit,
      nextPage: data.products.length === LIMIT ? pageParam + 1 : undefined,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export default function InfiniteProductScroll() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("search") || "";

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products", searchQuery],
    queryFn: ({ pageParam = 1 }) => fetchProducts({ pageParam, searchQuery }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch next page when in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Refetch on search query change
  useEffect(() => {
    refetch();
  }, [searchQuery, refetch]);

  if (status === "pending") {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-destructive">
          Error: {error?.message || "Failed to load products"}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  const allProducts = data?.pages?.flatMap((page) => page.products) || [];

  if (allProducts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground text-lg">
          {searchQuery
            ? `No products found for "${searchQuery}"`
            : "No products available"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Results Header */}
      {searchQuery && (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Search Results</h2>
          <p className="text-muted-foreground">
            Showing results for &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showDescription={true}
                showRating={true}
                showWishlist={true}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Loading More Indicator */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center items-center py-8">
          {isFetchingNextPage ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading more products...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Load more products...</span>
            </div>
          )}
        </div>
      )}

      {/* End Message */}
      {!hasNextPage && allProducts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            You&apos;ve reached the end! Showing {allProducts.length} products.
          </p>
        </div>
      )}
    </div>
  );
}

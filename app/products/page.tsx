"use client";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { ProductsResponse } from "@/types/product";

// Disable static generation for products page
export const dynamic = "force-dynamic";

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
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export default function ProductsPage() {
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

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
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      return Math.floor(lastPage.products.length / LIMIT) + 1;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "error") {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Products</h1>
          <p className="text-destructive mb-4">
            {error instanceof Error ? error.message : "Failed to load products"}
          </p>
          <button
            onClick={() => refetch()}
            className="text-primary hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Search Results Header */}
      {searchQuery && (
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Search Results for &ldquo;{searchQuery}&rdquo;
          </h1>
          <p className="text-muted-foreground">
            {data?.pages[0]?.total
              ? `Found ${data.pages[0].total} products`
              : "Loading..."}
          </p>
        </div>
      )}

      <div className="mb-8"></div>
      {status === "pending" ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
            {data?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showDescription={false}
                    showRating={true}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>

          {data?.pages[0]?.products.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">
                {searchQuery
                  ? `No results found for &ldquo;${searchQuery}&rdquo;`
                  : "No Products Found"}
              </h2>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search terms or browse our categories"
                  : "Try adjusting your search or browse our categories"}
              </p>
            </div>
          )}

          {hasNextPage && (
            <div ref={ref} className="flex justify-center items-center py-8">
              {isFetchingNextPage ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <button
                  onClick={() => fetchNextPage()}
                  className="text-primary hover:underline"
                >
                  Load More
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

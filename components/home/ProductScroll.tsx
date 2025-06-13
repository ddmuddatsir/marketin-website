"use client";

import { fetchAllProducts } from "@/lib/api/product";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useRef } from "react";

const ProductScroll = () => {
  const observer = useRef<IntersectionObserver | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["all-products"],
      queryFn: fetchAllProducts,
      getNextPageParam: (lastPage) => lastPage.nextSkip,
      initialPageParam: 0,
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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {allProducts.map((product, i) => {
        const isLast = i === allProducts.length - 1;
        return (
          <div
            key={product.id}
            ref={isLast ? lastProductRef : null}
            className="border rounded-2xl p-4 shadow hover:shadow-lg transition"
          >
            <Link href={`/products/${product.id}`}>
              <div>
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                </div>
                <h2 className="text-lg font-semibold truncate">
                  {product.title}
                </h2>
                <p className="text-sm text-gray-500 truncate">
                  {product.brand}
                </p>
                <p className="text-sm">${product.price}</p>
                <p className="text-xs text-yellow-600">⭐ {product.rating}</p>
                <p className="text-xs text-red-500">Stock: {product.stock}</p>
              </div>
            </Link>
          </div>
        );
      })}

      {isFetchingNextPage && (
        <div className="text-center mt-6">Loading more products...</div>
      )}
      {!hasNextPage && (
        <div className="text-center mt-6 text-gray-500">No more products.</div>
      )}
    </div>
  );
};

export default ProductScroll;

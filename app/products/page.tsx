"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
}

const LIMIT = 12;

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const url = query
      ? `https://dummyjson.com/products/search?q=${encodeURIComponent(
          query
        )}&limit=${LIMIT}&skip=${skip}`
      : `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.products.length === 0) {
      setHasMore(false);
    } else {
      setProducts((prev) => {
        const newProducts = data.products.filter(
          (newItem: Product) => !prev.find((p) => p.id === newItem.id)
        );
        return [...prev, ...newProducts];
      });
      setSkip((prev) => prev + LIMIT);
    }

    setLoading(false);
  }, [skip, hasMore, loading, query]);

  // Reset on query change
  useEffect(() => {
    setProducts([]);
    setSkip(0);
    setHasMore(true);
  }, [query]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchProducts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchProducts]
  );

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {query ? `Search Results for "${query}"` : "Product List"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, i) => {
          const isLast = i === products.length - 1;
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
      </div>
      {loading && (
        <div className="text-center mt-6">Loading more products...</div>
      )}
      {!hasMore && (
        <div className="text-center mt-6 text-gray-500">No more products.</div>
      )}
    </main>
  );
}

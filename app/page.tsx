"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaLaptop,
  FaMobileAlt,
  FaTshirt,
  FaCouch,
  FaCamera,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

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

const categories = [
  { name: "smartphones", icon: <FaMobileAlt /> },
  { name: "laptops", icon: <FaLaptop /> },
  { name: "tops", icon: <FaTshirt /> },
  { name: "furniture", icon: <FaCouch /> },
  { name: "cameras", icon: <FaCamera /> },
];

function getRandomProducts(array: Product[], count: number) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const [recommendedPage, setRecommendedPage] = useState(0);

  const RECOMMENDED_PER_PAGE = 5;
  const recommendedProducts = getRandomProducts(products, 12);
  const totalRecommendedPages = Math.ceil(
    recommendedProducts.length / RECOMMENDED_PER_PAGE
  );

  const handleNext = () => {
    setRecommendedPage((prev) => (prev + 1) % totalRecommendedPages);
  };

  const handlePrev = () => {
    setRecommendedPage((prev) =>
      prev === 0 ? totalRecommendedPages - 1 : prev - 1
    );
  };

  const paginatedProducts = recommendedProducts.slice(
    recommendedPage * RECOMMENDED_PER_PAGE,
    recommendedPage * RECOMMENDED_PER_PAGE + RECOMMENDED_PER_PAGE
  );

  const fetchProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const res = await fetch(
      `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`
    );
    const data = await res.json();

    if (data.products.length === 0) {
      setHasMore(false);
    } else {
      setProducts((prev) => {
        // Cegah duplikat
        const newProducts = data.products.filter(
          (newItem: Product) => !prev.find((p) => p.id === newItem.id)
        );
        return [...prev, ...newProducts];
      });
      setSkip((prev) => prev + LIMIT);
    }

    setLoading(false);
  }, [skip, hasMore, loading]);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Infinite scroll logic
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
    <main className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="relative w-full h-60 md:h-80 rounded-2xl overflow-hidden shadow-lg">
        <Image
          src="/banner.jpg" // ganti dengan path banner kamu (bisa juga dari URL online)
          alt="Banner"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-4xl font-bold">
            Welcome to Our Shop
          </h1>
        </div>
      </div>

      {/* Kategori Icon Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 justify-center my-8">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/products/category/${cat.name}`}
            className="flex flex-col items-center p-3 rounded-xl border shadow hover:bg-gray-100 transition"
          >
            <div className="text-2xl text-blue-600">{cat.icon}</div>
            <span className="text-sm capitalize mt-1">{cat.name}</span>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recommended for You</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar">
          {paginatedProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="min-w-[200px] max-w-[200px] border rounded-xl p-3 shadow hover:shadow-lg transition flex-shrink-0"
            >
              <div className="relative w-full h-32 mb-3">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-sm font-semibold truncate">
                {product.title}
              </h3>
              <p className="text-xs text-gray-500 truncate">{product.brand}</p>
              <p className="text-sm font-bold text-blue-600">
                ${product.price}
              </p>
            </Link>
          ))}
        </div>
      </div>

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

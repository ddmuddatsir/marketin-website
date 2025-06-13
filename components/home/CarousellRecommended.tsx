"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { PRODUCTS_PER_SLIDE } from "@/constants/home";
import { fetchRecommended } from "@/lib/api/product";
import { useCarousel } from "@/hooks/useCarousel";

export default function CarouselRecommended() {
  const { data: recommendedProducts = [], isLoading } = useQuery({
    queryKey: ["recommended"],
    queryFn: fetchRecommended,
  });

  const {
    carouselIndex,
    next: handleNext,
    prev: handlePrev,
    visibleRange,
  } = useCarousel(recommendedProducts.length, PRODUCTS_PER_SLIDE);

  const visibleProducts = recommendedProducts.slice(
    visibleRange.start,
    visibleRange.end
  );

  if (isLoading) {
    return <div className="text-center">Loading recommended products...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Rekomendasi Produk</h2>

      <div className="relative">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrev}
            disabled={carouselIndex === 0}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100 disabled:opacity-50"
          >
            <FaChevronLeft size={20} />
          </button>

          <div className="flex gap-4 overflow-hidden">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="md:min-w-[180px] md:max-w-[180px] min-w-[100px] max-w-[100px] bg-white rounded-2xl p-2 m-1 shadow hover:shadow-lg transition"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative w-full md:h-32 h-14 mb-2">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium truncate">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {product.brand}
                    </p>
                    <p className="text-sm font-bold">${product.price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={
              carouselIndex + PRODUCTS_PER_SLIDE >= recommendedProducts.length
            }
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100 disabled:opacity-50"
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

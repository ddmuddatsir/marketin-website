"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { fetchRecommended } from "@/lib/api/product";
import { SafeImage } from "@/components/ui/SafeImage";
import type { Product } from "@/types/product";

// Compact Product Card untuk Carousel
function CompactProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <div className="h-full bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
        {/* Image Container dengan aspect ratio yang lebih compact untuk mobile */}
        <div className="relative aspect-[4/3] flex-shrink-0">
          {product.image || product.thumbnail ? (
            <SafeImage
              src={product.image || product.thumbnail || ""}
              alt={product.title}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 480px) 33vw, (max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* Content - flexible height */}
        <div className="p-2 sm:p-2.5 flex flex-col flex-grow">
          <h3 className="font-medium text-sm sm:text-base text-gray-900 mb-1 flex-grow leading-tight overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5 mt-auto">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-xs text-gray-600">
              {"rating" in product &&
              typeof (product as { rating: number }).rating === "number"
                ? (product as { rating: number }).rating.toFixed(1)
                : "4.0"}
            </span>
          </div>

          {/* Price */}
          <p className="font-semibold text-sm sm:text-base mt-2">
            ${product.price?.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}
interface CarouselRecommendedProps {
  initialProducts?: Product[];
}

export default function CarouselRecommended({
  initialProducts = [],
}: CarouselRecommendedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const { data: products = initialProducts, isLoading } = useQuery({
    queryKey: ["recommended-products"],
    queryFn: () => fetchRecommended(12), // Fetch 12 products
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData: initialProducts.length > 0 ? initialProducts : undefined,
  });

  // Responsive items count
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      if (window.innerWidth < 480) {
        setItemsToShow(3);
      } else if (window.innerWidth < 640) {
        setItemsToShow(3);
      } else if (window.innerWidth < 768) {
        setItemsToShow(4);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(5);
      } else if (window.innerWidth < 1280) {
        setItemsToShow(6);
      } else {
        setItemsToShow(7);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Berbeda batas slide untuk mobile dan desktop
  const maxSlides = isMobile ? 2 : 3; // Mobile: maksimal 3 slide (index 0-2), Desktop: maksimal 4 slide (index 0-3)
  const maxIndex = Math.min(
    maxSlides,
    Math.max(0, products.length - itemsToShow)
  );

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Recommended Products
          </h2>
        </div>
        <div className="flex gap-1 sm:gap-2 overflow-hidden">
          {Array.from({ length: isMobile ? 3 : 7 }).map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-gray-200 rounded-lg h-60 sm:h-64 animate-pulse border border-gray-200"
              style={{
                width: isMobile
                  ? "calc(33.333% - 4px)" // 3 items untuk mobile dengan gap kecil
                  : "calc(14.286% - 8px)", // 7 items untuk desktop dengan gap kecil
              }}
            ></div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 sm:mb-12">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Recommended Products
        </h2>
      </div>

      {/* Slider Container with Navigation */}
      <div className="relative overflow-hidden">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          disabled={!canGoPrevious}
          className={`
            absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full 
            flex items-center justify-center transition-all duration-200 
            shadow-lg border border-gray-200 backdrop-blur-sm
            ${
              canGoPrevious
                ? "bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 hover:shadow-xl hover:border-blue-300"
                : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            }
          `}
          aria-label="Previous products"
        >
          <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          disabled={!canGoNext}
          className={`
            absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full 
            flex items-center justify-center transition-all duration-200 
            shadow-lg border border-gray-200 backdrop-blur-sm
            ${
              canGoNext
                ? "bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 hover:shadow-xl hover:border-blue-300"
                : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            }
          `}
          aria-label="Next products"
        >
          <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Slider Content */}
        <div
          ref={sliderRef}
          className="flex transition-transform duration-300 ease-in-out gap-1 sm:gap-2"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
            width: `${(products.length / itemsToShow) * 100}%`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 px-0.5 sm:px-1 h-60 sm:h-64"
              style={{ width: `${100 / products.length}%` }}
            >
              <CompactProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {maxIndex > 0 && (
        <div className="flex justify-center mt-4 sm:mt-6 gap-1 sm:gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                h-1.5 sm:h-2 rounded-full transition-all duration-200
                ${
                  index === currentIndex
                    ? "bg-blue-600 w-4 sm:w-6"
                    : "bg-gray-300 hover:bg-gray-400 w-1.5 sm:w-2"
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

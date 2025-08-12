"use client";

import { useQuery } from "@tanstack/react-query";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { fetchRecommended } from "@/lib/api/product";
import { useCarousel } from "@/hooks/useCarousel";
import { ProductCard } from "@/components/products/ProductCard";

const DESKTOP_PRODUCTS_PER_VIEW = 6; // 6 products per view on desktop
const TOTAL_VIEWS = 4; // Total number of views

export default function CarouselRecommended() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["recommended-products"],
    queryFn: () => fetchRecommended(DESKTOP_PRODUCTS_PER_VIEW * TOTAL_VIEWS), // Fetch 24 products (6 per view * 4 views)
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    currentSlide,
    nextSlide,
    prevSlide,
    containerRef,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useCarousel(products.length, DESKTOP_PRODUCTS_PER_VIEW);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  // Group products into views
  const views = [];
  for (let i = 0; i < products.length; i += DESKTOP_PRODUCTS_PER_VIEW) {
    views.push(products.slice(i, i + DESKTOP_PRODUCTS_PER_VIEW));
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-6">Recommended Products</h2>
      <div className="relative flex items-center justify-center gap-4 px-8">
        <button
          onClick={prevSlide}
          className="flex-shrink-0 bg-white/80 p-1.5 rounded-full shadow-lg hover:bg-white transition-colors z-10"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={containerRef}
          className="overflow-hidden flex-1 max-w-[calc(100%-4rem)]"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {views.map((viewProducts, viewIndex) => (
              <div
                key={viewIndex}
                className="flex-shrink-0 w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
              >
                {viewProducts.map((product) => (
                  <div key={product.id} className="min-w-0">
                    <ProductCard
                      product={product}
                      showDescription={false}
                      showRating={true}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={nextSlide}
          className="flex-shrink-0 bg-white/80 p-1.5 rounded-full shadow-lg hover:bg-white transition-colors z-10"
          aria-label="Next slide"
        >
          <FaChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: TOTAL_VIEWS }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.scrollTo({
                  left: index * containerRef.current.offsetWidth,
                  behavior: "smooth",
                });
              }
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentSlide === index ? "bg-gray-900" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

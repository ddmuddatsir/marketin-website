import Banner from "@/components/home/Banner";
import CategoryList from "@/components/home/CategoryList";
import CarouselRecommended from "@/components/home/CarousellRecommended";
import ProductScroll from "@/components/home/ProductScroll";
import { externalApiClient } from "@/lib/api/client";
import { Product } from "@/types/product";
import { Suspense } from "react";

// ISR - Revalidate every 30 minutes for home page
export const revalidate = 1800;

// Server-side data fetching for recommended products
async function fetchRecommendedProducts(): Promise<Product[]> {
  try {
    const response = await externalApiClient.get("/products?limit=12");
    return response.data.products || [];
  } catch (error) {
    console.error("Failed to fetch recommended products:", error);
    return [];
  }
}

function HomeLoading() {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  // Pre-fetch recommended products for SSR
  const recommendedProducts = await fetchRecommendedProducts();

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Banner - Static content */}
      <Banner />

      {/* Kategori - Static content */}
      <CategoryList />

      {/* Rekomendasi Produk - Client-side dengan initial data */}
      <Suspense
        fallback={<div className="h-64 bg-gray-200 rounded-lg animate-pulse" />}
      >
        <CarouselRecommended initialProducts={recommendedProducts} />
      </Suspense>

      {/* Semua Produk (infinite scroll) - Client-side */}
      <Suspense fallback={<HomeLoading />}>
        <ProductScroll />
      </Suspense>
    </main>
  );
}

import "keen-slider/keen-slider.min.css";
import Banner from "@/components/home/Banner";
import CategoryList from "@/components/home/CategoryList";
import CarouselRecommended from "@/components/home/CarousellRecommended";
import ProductScroll from "@/components/home/ProductScroll";

export default async function Home() {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Banner */}
      <Banner />

      {/* Kategori */}
      <CategoryList />

      {/* Rekomendasi Produk */}
      <CarouselRecommended />

      {/* Semua Produk (infinite scroll) */}
      <ProductScroll />
    </div>
  );
}

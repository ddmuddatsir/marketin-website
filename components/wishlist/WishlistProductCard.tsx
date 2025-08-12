import type { Product } from "@/types/product";
import { ProductCard } from "../products/ProductCard";

export default function WishlistProductCard({ product }: { product: Product }) {
  return (
    <ProductCard
      product={product}
      showDescription={false}
      showRating={true}
      showAddToCart={false}
      showWishlist={true}
    />
  );
}

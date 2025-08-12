"use client";

import WishlistProductCard from "@/components/wishlist/WishlistProductCard";
import { useWishlist } from "@/hooks/useWishlist";

export const dynamic = "force-dynamic";

export default function Page() {
  const { wishlist, loading } = useWishlist();

  if (loading)
    return <div className="p-8 text-center">Loading wishlist...</div>;
  if (!wishlist || wishlist.items.length === 0)
    return <div className="p-8 text-center">Your wishlist is empty.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">My Wishlist</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.items.map((item) => {
          const product = item.product;
          if (product) {
            return (
              <WishlistProductCard
                key={item.id}
                product={{
                  ...product,
                  id: product.id,
                  image:
                    "thumbnail" in product &&
                    typeof product.thumbnail === "string" &&
                    product.thumbnail
                      ? product.thumbnail
                      : typeof product.image === "string" && product.image
                      ? product.image
                      : "/no-image.png",
                  category:
                    "category" in product &&
                    typeof product.category === "string" &&
                    product.category
                      ? product.category
                      : "",
                  description:
                    "description" in product &&
                    typeof product.description === "string" &&
                    product.description
                      ? product.description
                      : "",
                }}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

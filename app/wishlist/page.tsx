"use client";

import WishlistProductCard from "@/components/wishlist/WishlistProductCard";
import { useWishlist } from "@/hooks/useWishlist";
import { AuthRequiredMessage } from "@/components/auth/AuthRequiredMessage";
import { useAuth } from "@/contexts/AuthContext";

export const dynamic = "force-dynamic";

export default function Page() {
  const { user, loading: authLoading } = useAuth();
  const { wishlist, loading, isAuthenticated } = useWishlist();

  // Show loading while checking authentication
  if (authLoading || loading) {
    return <div className="p-8 text-center">Loading wishlist...</div>;
  }

  // Show auth required message if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">My Wishlist</h1>
        <AuthRequiredMessage />
      </div>
    );
  }

  // Show empty wishlist message if authenticated but no items
  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">My Wishlist</h1>
        <div className="text-center p-8">
          <div className="text-6xl mb-4">💝</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600">
            Start adding products you love to your wishlist!
          </p>
        </div>
      </div>
    );
  }

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

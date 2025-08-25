"use client";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";

export function WishlistStatus() {
  const { isOnline, isAuthenticated } = useWishlist();
  const { user } = useAuth();

  // Only show for authenticated users
  if (!isAuthenticated || !user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`
        px-3 py-2 rounded-lg text-sm font-medium shadow-lg transition-all
        ${
          isOnline
            ? "bg-green-500 text-white"
            : "bg-orange-500 text-white animate-pulse"
        }
      `}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-green-200" : "bg-orange-200"
            }`}
          />
          <span>
            {isOnline ? "Wishlist synced" : "Offline - will sync later"}
          </span>
        </div>
      </div>
    </div>
  );
}

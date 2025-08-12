import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "@/hooks/useWishlist";

interface WishlistButtonProps {
  productId: string | number;
  className?: string;
}

export default function WishlistButton({
  productId,
  className = "",
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);

  const productIdString = String(productId);
  const inWishlist = isInWishlist(productIdString);

  const handleToggle = async () => {
    setIsLoading(true);

    try {
      if (inWishlist) {
        await removeFromWishlist(productIdString);
      } else {
        await addToWishlist(productIdString);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        p-2 rounded-full transition-all duration-200 
        ${
          inWishlist
            ? "text-red-500 bg-red-50 hover:bg-red-100"
            : "text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-red-500"
        }
        ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
        ${className}
      `}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isLoading ? (
        <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : inWishlist ? (
        <FaHeart className="w-5 h-5" />
      ) : (
        <FaRegHeart className="w-5 h-5" />
      )}
    </button>
  );
}

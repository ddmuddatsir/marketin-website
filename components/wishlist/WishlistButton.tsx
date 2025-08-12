import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistButton({ productId }: { productId: string }) {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = wishlist?.items.some(
    (item) => item.productId === productId
  );

  return (
    <button
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={
        isWishlisted
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 hover:text-red-500"
      }
      onClick={() =>
        isWishlisted ? removeFromWishlist(productId) : addToWishlist(productId)
      }
    >
      {isWishlisted ? <FaHeart size={22} /> : <FaRegHeart size={22} />}
    </button>
  );
}

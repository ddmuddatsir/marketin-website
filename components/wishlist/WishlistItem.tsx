import Image from "next/image";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { WishlistItemProps } from "@/types/wishlist";

export default function WishlistItem({ item }: WishlistItemProps) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded border">
        {item.product?.image ? (
          <Image
            src={item.product.image}
            alt={item.product.title}
            width={80}
            height={80}
            className="object-contain w-20 h-20"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-base line-clamp-1">
          {item.product?.title || "Unknown Product"}
        </div>
        <div className="flex gap-2 mt-2">
          <WishlistButton productId={String(item.productId)} />
        </div>
      </div>
    </div>
  );
}

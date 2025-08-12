"use client";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FaStar, FaTrash } from "react-icons/fa";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { SafeImage } from "@/components/ui/SafeImage";
import type { Product } from "@/types/product";

export function ProductCard({
  product,
  showDescription = true,
  showRating = false,
  showAddToCart = false,
  showWishlist = false,
  showRemove = false,
  quantity,
  onAddToCart,
  onRemove,
  actions,
}: {
  product: Product;
  showDescription?: boolean;
  showRating?: boolean;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  showRemove?: boolean;
  quantity?: number;
  onAddToCart?: () => void;
  onRemove?: () => void;
  actions?: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square">
          {product.image || product.thumbnail ? (
            <SafeImage
              src={product.image || product.thumbnail || ""}
              alt={product.title}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold line-clamp-1">{product.title}</h3>
          </Link>
          {showWishlist && <WishlistButton productId={String(product.id)} />}
        </div>
        {showRating && (
          <div className="flex items-center gap-1 text-yellow-500 mt-1">
            <FaStar />
            <span className="text-sm font-medium text-gray-700">
              {"rating" in product &&
              typeof (product as { rating: number }).rating === "number"
                ? (product as { rating: number }).rating.toFixed(1)
                : "-"}
            </span>
          </div>
        )}
        {showDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        )}
        <p className="font-semibold mt-2">${product.price?.toFixed(2)}</p>
        {typeof quantity === "number" && (
          <div className="text-xs text-gray-500 mt-1">Qty: {quantity}</div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {showAddToCart && (
          <button
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold"
            onClick={onAddToCart}
          >
            Add to Cart
          </button>
        )}
        {showRemove && (
          <button
            className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            onClick={onRemove}
          >
            <FaTrash className="mr-1" /> Remove
          </button>
        )}
        {actions}
      </CardFooter>
    </Card>
  );
}

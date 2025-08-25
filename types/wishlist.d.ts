import { Product } from "./product";

export interface WishlistItem {
  id: string;
  userId?: string;
  productId: string;
  addedAt: Date | string | number;
  product?: Product | null;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

interface WishlistItemProps {
  item: {
    id: string;
    productId: string;
    product?: Product;
  };
}

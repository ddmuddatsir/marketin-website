import { Product } from "./product";

export interface WishlistItem {
  id: string;
  wishlistId?: string;
  productId?: string;
  createdAt?: string;
  updatedAt?: string;
  product?: {
    id: string;
    title: string;
    image?: string;
    thumbnail?: string;
    price: number;
    description?: string;
    rating?: number;
  };
  [key: string]: unknown;
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

import { useState, useEffect } from "react";
import { WishlistItem } from "@/types/wishlist";
import { externalApiClient } from "@/lib/api/client";

export interface WishlistData {
  items: WishlistItem[];
}

const WISHLIST_STORAGE_KEY = "wishlist_items";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistData>({ items: [] });
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsedItems = JSON.parse(stored) as WishlistItem[];
        const items = parsedItems.map((item) => ({
          ...item,
          addedAt: new Date(item.addedAt as string | number | Date),
        }));
        setWishlist({ items });
      }
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
    }
    setLoading(false);
  }, []);

  const saveToLocalStorage = (items: WishlistItem[]) => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      setWishlist({ items });
    } catch (error) {
      console.error("Error saving wishlist:", error);
    }
  };

  const addToWishlist = async (productId: string): Promise<boolean> => {
    try {
      // Check if already in wishlist
      if (wishlist.items.some((item) => item.productId === productId)) {
        return true;
      }

      // Fetch product details
      const response = await externalApiClient.get(`/products/${productId}`);
      const product = response.data;

      const newItem: WishlistItem = {
        id: Date.now().toString(),
        productId,
        product,
        addedAt: new Date(),
      };

      const newItems = [...wishlist.items, newItem];
      saveToLocalStorage(newItems);

      console.log("Added to wishlist:", productId);
      return true;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return false;
    }
  };

  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    try {
      const newItems = wishlist.items.filter(
        (item) => item.productId !== productId
      );
      saveToLocalStorage(newItems);

      console.log("Removed from wishlist:", productId);
      return true;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return false;
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.items.some((item) => item.productId === productId);
  };

  const getWishlistCount = (): number => {
    return wishlist.items.length;
  };

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
  };
};

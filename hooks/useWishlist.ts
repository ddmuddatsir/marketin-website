import { useState, useEffect, useCallback } from "react";
import { WishlistItem } from "@/types/wishlist";
import { Product } from "@/types/product";
import { externalApiClient } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";

export interface WishlistData {
  items: WishlistItem[];
}

const WISHLIST_STORAGE_KEY = "wishlist_items";

export const useWishlist = () => {
  const { user, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistData>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // Check if development mode is enabled
  const isDevelopmentMode =
    typeof window !== "undefined" &&
    (window.location.search.includes("dev=true") ||
      process.env.NODE_ENV === "development");

  console.log(
    "🔧 useWishlist initialized - Development mode:",
    isDevelopmentMode,
    "User:",
    !!user
  );

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loadFromLocalStorage = () => {
    try {
      console.log("💾 Loading wishlist from localStorage");
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsedItems = JSON.parse(stored) as WishlistItem[];
        console.log(
          "📱 Found localStorage items:",
          parsedItems.length,
          parsedItems
        );

        const items = parsedItems.map((item) => ({
          ...item,
          addedAt: new Date(item.addedAt as string | number | Date),
        }));

        console.log("✅ Setting wishlist from localStorage:", items.length);
        setWishlist({ items });
      } else {
        console.log("📱 No localStorage data found");
      }
    } catch (error) {
      console.error("❌ Error loading wishlist from localStorage:", error);
    }
  };

  const saveToLocalStorage = (items: WishlistItem[]) => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
    }
  };

  const loadFromFirebase = useCallback(async () => {
    // Check if we're explicitly in development mode with dev=true parameter
    const urlParams = new URLSearchParams(window.location.search);
    const isExplicitDevMode =
      isDevelopmentMode && urlParams.get("dev") === "true";

    // In development mode without user, only load if dev=true
    if (isDevelopmentMode && !user && isExplicitDevMode) {
      console.log("🔄 Development mode: Loading wishlist with test token");
      try {
        const response = await fetch("/api/wishlist", {
          headers: {
            Authorization: `Bearer test-token`,
          },
        });

        console.log("📡 Development response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("📥 Development wishlist data:", data);

          if (data.items && Array.isArray(data.items)) {
            const items = data.items.map(
              (item: {
                id: string;
                userId?: string;
                productId: string;
                addedAt: unknown;
                product?: Product | null;
              }) => {
                // Handle Firestore timestamp conversion
                let addedAt: Date;
                if (
                  typeof item.addedAt === "object" &&
                  item.addedAt !== null &&
                  "seconds" in item.addedAt
                ) {
                  // Firestore timestamp
                  addedAt = new Date(
                    (item.addedAt as { seconds: number }).seconds * 1000
                  );
                } else {
                  // Regular date
                  addedAt = new Date(item.addedAt as string | number | Date);
                }

                return {
                  id: item.id,
                  userId: item.userId,
                  productId: item.productId,
                  addedAt,
                  product: item.product || null,
                };
              }
            ) as WishlistItem[];

            console.log(
              "✅ Development processed wishlist items:",
              items.length,
              items
            );
            setWishlist({ items });
            saveToLocalStorage(items);
          } else {
            console.log(
              "📝 No items in development response, setting empty wishlist"
            );
            setWishlist({ items: [] });
          }
        } else {
          const errorText = await response.text();
          console.error(
            "❌ Development response not ok:",
            response.status,
            errorText
          );
          setWishlist({ items: [] });
        }
      } catch (error) {
        console.error("❌ Error loading from development API:", error);
        setWishlist({ items: [] });
      }
      return;
    }

    if (!user) {
      console.log("❌ loadFromFirebase: No user and not in development mode");
      return;
    }

    try {
      console.log("🔄 Loading wishlist from Firebase for user:", user.uid);
      const token = await user.getIdToken();
      const response = await fetch("/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Firebase response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("📥 Firebase wishlist data:", data);

        if (data.items && Array.isArray(data.items)) {
          const items = data.items.map(
            (item: {
              id: string;
              userId?: string;
              productId: string;
              addedAt: unknown;
              product?: Product | null;
            }) => {
              // Handle Firestore timestamp conversion
              let addedAt: Date;
              if (
                typeof item.addedAt === "object" &&
                item.addedAt !== null &&
                "seconds" in item.addedAt
              ) {
                // Firestore timestamp
                addedAt = new Date(
                  (item.addedAt as { seconds: number }).seconds * 1000
                );
              } else {
                // Regular date
                addedAt = new Date(item.addedAt as string | number | Date);
              }

              return {
                id: item.id,
                userId: item.userId,
                productId: item.productId,
                addedAt,
                product: item.product || null,
              };
            }
          ) as WishlistItem[];

          console.log("✅ Processed wishlist items:", items.length, items);
          setWishlist({ items });
          // Also save to localStorage for offline access
          saveToLocalStorage(items);
        } else {
          console.log("📝 No items in response, setting empty wishlist");
          setWishlist({ items: [] });
        }
      } else {
        const errorText = await response.text();
        console.error(
          "❌ Firebase response not ok:",
          response.status,
          errorText
        );
        // Fallback to localStorage on error
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("❌ Error loading from Firebase:", error);
      // Fallback to localStorage on error
      loadFromLocalStorage();
    }
  }, [user, isDevelopmentMode]);

  // Load wishlist based on auth status
  useEffect(() => {
    const loadWishlist = async () => {
      console.log(
        "🔄 Loading wishlist - Auth loading:",
        authLoading,
        "User:",
        !!user,
        "Dev mode:",
        isDevelopmentMode
      );

      if (authLoading) {
        console.log("⏳ Still authenticating...");
        return;
      }

      // Check if we're explicitly in development mode with dev=true parameter
      const urlParams = new URLSearchParams(window.location.search);
      const isExplicitDevMode =
        isDevelopmentMode && urlParams.get("dev") === "true";

      // In development mode, only load if explicitly requested via ?dev=true
      if (isDevelopmentMode && !user && isExplicitDevMode) {
        console.log("🔧 Development mode with dev=true - loading without user");
        try {
          await loadFromFirebase();
        } catch (error) {
          console.error("❌ Error loading wishlist in dev mode:", error);
          setWishlist({ items: [] });
        } finally {
          setLoading(false);
        }
        return;
      }

      if (!user) {
        // Clear wishlist if not authenticated and not in explicit dev mode
        console.log("🚫 No user - clearing wishlist");
        setWishlist({ items: [] });
        setLoading(false);
        return;
      }

      console.log("👤 User authenticated, loading wishlist for:", user.uid);

      try {
        if (isOnline) {
          console.log("🌐 Online - loading from Firebase");
          // Load from Firebase when online and authenticated
          await loadFromFirebase();
        } else {
          console.log("📴 Offline - loading from localStorage");
          // Load from localStorage when offline but authenticated
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error("❌ Error loading wishlist:", error);
        // Fallback to localStorage if Firebase fails
        console.log("🔄 Falling back to localStorage");
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user, authLoading, isOnline, loadFromFirebase, isDevelopmentMode]);

  const addToWishlist = async (productId: string): Promise<boolean> => {
    // Require authentication
    if (!user) {
      console.warn("❌ Cannot add to wishlist: User not authenticated");
      return false;
    }

    try {
      console.log("➕ Adding to wishlist:", productId, "for user:", user.uid);

      // Check if already in wishlist
      if (wishlist.items.some((item) => item.productId === productId)) {
        console.log("ℹ️ Product already in wishlist:", productId);
        return true;
      }

      // Fetch product details
      const response = await externalApiClient.get(`/products/${productId}`);
      const product = response.data;
      console.log("📦 Fetched product:", product.title);

      const newItem: WishlistItem = {
        id: Date.now().toString(),
        productId,
        product,
        addedAt: new Date(),
      };

      const newItems = [...wishlist.items, newItem];
      console.log("📝 New wishlist items count:", newItems.length);

      // Update state
      setWishlist({ items: newItems });

      // Save to localStorage
      saveToLocalStorage(newItems);
      console.log("💾 Saved to localStorage");

      // Sync to Firebase if online
      if (isOnline) {
        try {
          console.log("🔄 Syncing to Firebase...");
          const token = await user.getIdToken();
          const firebaseResponse = await fetch("/api/wishlist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId, product }),
          });

          if (firebaseResponse.ok) {
            console.log("✅ Successfully synced to Firebase");
          } else {
            console.error(
              "❌ Firebase sync failed:",
              await firebaseResponse.text()
            );
          }
        } catch (error) {
          console.error("❌ Error syncing to Firebase:", error);
          // Continue anyway, will sync later when online
        }
      } else {
        console.log("📴 Offline - will sync later");
      }

      console.log("✅ Added to wishlist successfully:", productId);
      return true;
    } catch (error) {
      console.error("❌ Error adding to wishlist:", error);
      return false;
    }
  };

  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    // Require authentication
    if (!user) {
      console.warn("Cannot remove from wishlist: User not authenticated");
      return false;
    }

    try {
      const newItems = wishlist.items.filter(
        (item) => item.productId !== productId
      );

      // Update state
      setWishlist({ items: newItems });

      // Save to localStorage
      saveToLocalStorage(newItems);

      // Sync to Firebase if online
      if (isOnline) {
        try {
          const token = await user.getIdToken();
          await fetch(`/api/wishlist?productId=${productId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error("Error syncing removal to Firebase:", error);
          // Continue anyway, will sync later when online
        }
      }

      console.log("Removed from wishlist:", productId);
      return true;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return false;
    }
  };

  const isInWishlist = (productId: string): boolean => {
    // Only show as in wishlist if user is authenticated (not just dev mode)
    if (!user && !isDevelopmentMode) return false;
    // In development mode, only show if explicitly requested
    if (isDevelopmentMode && !user) {
      const urlParams = new URLSearchParams(window.location.search);
      const isDevMode = urlParams.get("dev") === "true";
      if (!isDevMode) return false;
    }
    return wishlist.items.some((item) => item.productId === productId);
  };

  const getWishlistCount = (): number => {
    // Only show count if user is authenticated (not in development mode)
    if (!user && !isDevelopmentMode) return 0;
    // In development mode, only show count if explicitly requested
    if (isDevelopmentMode && !user) {
      // Check if we're on wishlist page with dev parameter
      const urlParams = new URLSearchParams(window.location.search);
      const isDevMode = urlParams.get("dev") === "true";
      if (!isDevMode) return 0;
    }
    return wishlist.items.length;
  };

  // Clear wishlist (for logout)
  const clearWishlist = () => {
    setWishlist({ items: [] });
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
  };

  return {
    wishlist: user || isDevelopmentMode ? wishlist : { items: [] }, // Return wishlist if authenticated or in dev mode
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist,
    isOnline,
    isAuthenticated: !!user || isDevelopmentMode,
  };
};

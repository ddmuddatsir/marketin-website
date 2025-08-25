import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import { Cart, CartItem } from "@/types/cart";
import { externalApiClient } from "@/lib/api/client";

const CART_STORAGE_KEY = "cart_items";

export function useCart() {
  const { user, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage
  const loadFromLocalStorage = () => {
    try {
      console.log("💾 Loading cart from localStorage");
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsedItems = JSON.parse(stored) as CartItem[];
        console.log("📱 Found localStorage cart items:", parsedItems.length);

        const items = parsedItems.map((item) => ({
          ...item,
          addedAt: new Date(item.addedAt as string | number | Date),
        }));

        const total = items.reduce(
          (sum, item) => sum + (item.price || 0) * item.quantity,
          0
        );
        const count = items.reduce((sum, item) => sum + item.quantity, 0);

        setCart({ items, total, count });
      } else {
        console.log("📱 No localStorage cart data found");
        setCart({ items: [], total: 0, count: 0 });
      }
    } catch (error) {
      console.error("❌ Error loading cart from localStorage:", error);
      setCart({ items: [], total: 0, count: 0 });
    }
  };

  // Save to localStorage
  const saveToLocalStorage = (items: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  };

  // Load from Firebase (works for both authenticated and guest users)
  const loadFromFirebase = useCallback(async () => {
    try {
      console.log(
        "🔄 Loading cart from Firebase for user:",
        user?.id || "guest"
      );
      const response = await fetch("/api/cart", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log("📡 API Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Firebase cart loaded successfully:", data);

        // Ensure the data structure matches our Cart interface
        const cartData = {
          items: data.items || [],
          total: data.total || 0,
          count: data.count || 0,
        };

        // Only set Firebase data if it has items, otherwise keep localStorage data
        if (cartData.items.length > 0) {
          console.log(
            "📦 Using Firebase cart data with",
            cartData.items.length,
            "items"
          );
          setCart(cartData);
          // Sync to localStorage if items exist
          saveToLocalStorage(cartData.items);
        } else {
          // Firebase is empty, check localStorage for guest cart data
          console.log("📱 Firebase cart empty, checking localStorage");
          const stored = localStorage.getItem(CART_STORAGE_KEY);
          if (stored) {
            console.log("💾 Using localStorage data instead of empty Firebase");
            loadFromLocalStorage();
          } else {
            // Both Firebase and localStorage are empty
            console.log("📭 Both Firebase and localStorage are empty");
            setCart(cartData);
          }
        }
      } else {
        console.log(
          "📱 Firebase cart response not ok, status:",
          response.status
        );
        const errorData = await response.text();
        console.log("Error response:", errorData);
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("❌ Error loading cart from Firebase:", error);
      loadFromLocalStorage();
    }
  }, [user]); // Remove user dependency since we handle both authenticated and guest users

  // Initial load
  useEffect(() => {
    if (authLoading) return;

    setLoading(true);
    // Load from Firebase for both authenticated and guest users
    loadFromFirebase().finally(() => setLoading(false));
  }, [user, authLoading, loadFromFirebase]);

  const fetchCart = useCallback(async () => {
    // Always load from Firebase (supports both authenticated and guest users)
    await loadFromFirebase();
  }, [loadFromFirebase]);

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      // Fetch product details from DummyJSON API
      const productResponse = await externalApiClient.get(
        `/products/${productId}`
      );
      const product = productResponse.data;

      if (!product) {
        showError(
          "Product Not Found",
          "The requested product could not be found."
        );
        return;
      }

      const newItem: CartItem = {
        id: Date.now().toString(),
        productId: productId.toString(),
        quantity,
        price: product.price,
        name: product.title,
        image: product.thumbnail || product.images?.[0],
        addedAt: new Date(),
        product: {
          ...product,
          image: product.thumbnail || product.images?.[0], // Ensure image field is set
        },
        userId: user?.id || "guest",
      };

      // Try Firebase first, fallback to localStorage if authentication fails
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            productId: productId.toString(),
            quantity,
            price: product.price,
            name: product.title,
            image: product.thumbnail || product.images?.[0],
          }),
        });

        if (response.ok) {
          console.log("✅ Item added to Firebase cart successfully");
          await fetchCart();
          showSuccess(
            "Added to Cart! 🛒",
            `${quantity} item${quantity > 1 ? "s" : ""} added successfully`,
            {
              label: "View Cart",
              onClick: () => router.push("/cart"),
            }
          );
          return;
        } else if (response.status === 401) {
          console.log(
            "🔄 Firebase requires authentication, using localStorage fallback"
          );
          // Continue to localStorage fallback below
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("Add to cart failed:", response.status, errorData);
          throw new Error(
            errorData.message || errorData.error || "Failed to add to cart"
          );
        }
      } catch (fetchError) {
        console.log(
          "🔄 Firebase request failed, using localStorage fallback:",
          fetchError
        );
        // Continue to localStorage fallback below
      }

      // localStorage fallback (for guest users or when Firebase fails)
      console.log("💾 Adding item to localStorage cart");
      const currentItems = cart?.items || [];
      const existingItemIndex = currentItems.findIndex(
        (item) => item.productId === productId.toString()
      );

      let updatedItems;
      if (existingItemIndex !== -1) {
        updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        console.log(
          `📦 Updated existing item quantity: ${updatedItems[existingItemIndex].quantity}`
        );
      } else {
        updatedItems = [...currentItems, newItem];
        console.log("📦 Added new item to localStorage cart");
      }

      const total = updatedItems.reduce(
        (sum, item) => sum + (item.price || 0) * item.quantity,
        0
      );
      const count = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      setCart({ items: updatedItems, total, count });
      saveToLocalStorage(updatedItems);

      showSuccess(
        "Added to Cart! 🛒",
        `${quantity} item${quantity > 1 ? "s" : ""} added successfully`,
        {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        }
      );
    } catch (error) {
      console.error("Failed to add to cart:", error);
      showError(
        "Failed to Add Item",
        "There was an error adding the item to your cart. Please try again."
      );
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      if (user) {
        // Find item in Firebase and remove
        const item = cart?.items.find((item) => item.productId === productId);
        if (item?.id) {
          const response = await fetch(`/api/cart/${item.id}`, {
            method: "DELETE",
            credentials: "include",
          });

          if (response.ok) {
            await fetchCart();
          } else {
            throw new Error("Failed to remove from cart");
          }
        }
      } else {
        // Remove from localStorage
        const currentItems = cart?.items || [];
        const updatedItems = currentItems.filter(
          (item) => item.productId !== productId
        );

        const total = updatedItems.reduce(
          (sum, item) => sum + (item.price || 0) * item.quantity,
          0
        );
        const count = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        setCart({ items: updatedItems, total, count });
        saveToLocalStorage(updatedItems);
      }

      showSuccess("Item Removed", "Item removed from cart successfully");
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      showError("Failed to Remove", "Error removing item from cart");
    }
  };

  const increaseQuantity = async (productId: string) => {
    try {
      if (user) {
        const item = cart?.items.find((item) => item.productId === productId);
        if (item?.id) {
          const response = await fetch(`/api/cart/${item.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ quantity: item.quantity + 1 }),
          });

          if (response.ok) {
            await fetchCart();
          }
        }
      } else {
        const currentItems = cart?.items || [];
        const updatedItems = currentItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        const total = updatedItems.reduce(
          (sum, item) => sum + (item.price || 0) * item.quantity,
          0
        );
        const count = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        setCart({ items: updatedItems, total, count });
        saveToLocalStorage(updatedItems);
      }
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  };

  const decreaseQuantity = async (productId: string) => {
    try {
      if (user) {
        const item = cart?.items.find((item) => item.productId === productId);
        if (item?.id && item.quantity > 1) {
          const response = await fetch(`/api/cart/${item.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ quantity: item.quantity - 1 }),
          });

          if (response.ok) {
            await fetchCart();
          }
        }
      } else {
        const currentItems = cart?.items || [];
        const updatedItems = currentItems.map((item) =>
          item.productId === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );

        const total = updatedItems.reduce(
          (sum, item) => sum + (item.price || 0) * item.quantity,
          0
        );
        const count = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        setCart({ items: updatedItems, total, count });
        saveToLocalStorage(updatedItems);
      }
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        const response = await fetch("/api/cart", {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          setCart({ items: [], total: 0, count: 0 });
        }
      } else {
        setCart({ items: [], total: 0, count: 0 });
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const orderNow = async (productId: string, quantity = 1) => {
    if (!user) {
      showError("Authentication Required", "Please login to place an order");
      return false;
    }

    try {
      showSuccess(
        "Proceeding to Checkout",
        `Redirecting to checkout page with ${quantity} item${
          quantity > 1 ? "s" : ""
        }...`,
        {
          label: "Continue",
          onClick: () => router.push("/checkout"),
        }
      );

      router.push(`/checkout?product=${productId}&quantity=${quantity}`);
      return true;
    } catch (error) {
      console.error("Failed to proceed with order:", error);
      showError("Order Failed", "There was an error processing your order");
      return false;
    }
  };

  return {
    cart,
    loading,
    fetchCart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    orderNow,
  };
}

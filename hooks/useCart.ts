import { useState, useEffect, useCallback, useRef } from "react";
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
  // Track previous user state to detect logout
  const prevUserRef = useRef(user);

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
        user?.uid || "guest"
      );

      // Prepare headers
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add authorization header if user is authenticated
      if (user) {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
        console.log("🔑 Added Firebase token to request headers");
      }

      const response = await fetch("/api/cart", {
        headers,
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

  // Handle user authentication state changes
  useEffect(() => {
    // Detect logout: previous user existed but current user is null
    if (prevUserRef.current && !user && !authLoading) {
      console.log("🔄 User logged out, clearing cart");
      setCart({ items: [], total: 0, count: 0 });
      localStorage.removeItem(CART_STORAGE_KEY);
    }
    prevUserRef.current = user;
  }, [user, authLoading]);

  // Initial load
  useEffect(() => {
    if (authLoading) return;

    setLoading(true);

    // If user is null (logged out), clear the cart
    if (user === null) {
      console.log("🔄 User logged out, clearing cart");
      setCart({ items: [], total: 0, count: 0 });
      localStorage.removeItem(CART_STORAGE_KEY);
      setLoading(false);
      return;
    }

    // Load from Firebase for both authenticated and guest users
    loadFromFirebase().finally(() => setLoading(false));
  }, [user, authLoading, loadFromFirebase]);

  const fetchCart = useCallback(async () => {
    // Always load from Firebase (supports both authenticated and guest users)
    await loadFromFirebase();
  }, [loadFromFirebase]);

  const addToCart = async (productId: string | number, quantity = 1) => {
    // Check if user is authenticated before proceeding
    if (!user) {
      console.warn("❌ Cannot add to cart: User not authenticated");
      showError("Login Required", "Please login to add items to cart");
      // Redirect to login page after showing error
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      return;
    }

    // Store previous cart state for rollback
    const previousCart = cart ? { ...cart, items: [...cart.items] } : null;

    try {
      // Get product details
      const productResponse = await externalApiClient.get(
        `/products/${productId}`
      );
      const product = productResponse.data;

      // OPTIMISTIC UPDATE: Update UI immediately
      if (cart) {
        const existingItemIndex = cart.items.findIndex(
          (item) => item.productId === productId.toString()
        );

        let newItems: CartItem[];
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          newItems = [...cart.items];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + quantity,
          };
        } else {
          // Add new item
          const newItem: CartItem = {
            id: Date.now().toString(), // Temporary ID
            productId: productId.toString(),
            quantity,
            price: product.price,
            name: product.title,
            image: product.thumbnail || product.images?.[0],
            addedAt: new Date(),
          };
          newItems = [...cart.items, newItem];
        }

        const newTotal = newItems.reduce(
          (sum, item) => sum + (item.price || 0) * item.quantity,
          0
        );
        const newCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

        const optimisticCart = {
          items: newItems,
          total: newTotal,
          count: newCount,
        };
        setCart(optimisticCart);
        saveToLocalStorage(newItems);

        // Show immediate success feedback
        showSuccess(
          "Added to Cart! 🛒",
          `${quantity} item${quantity > 1 ? "s" : ""} added successfully`,
          {
            label: "View Cart",
            onClick: () => router.push("/cart"),
          }
        );
      }

      // Background server request
      const token = await user.getIdToken();
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
        // Sync with server data to get accurate cart state
        await fetchCart();
      } else {
        // ROLLBACK: Restore previous state on server error
        if (previousCart) {
          setCart(previousCart);
          saveToLocalStorage(previousCart.items);
        }

        const errorData = await response.json().catch(() => ({}));
        console.error("Add to cart failed:", response.status, errorData);

        if (response.status === 401) {
          showError("Login Required", "Please login to add items to your cart");
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        } else {
          showError(
            "Failed to Add Item",
            errorData.message ||
              errorData.error ||
              "Server error - changes have been reverted"
          );
        }
      }
    } catch (error) {
      // ROLLBACK: Restore previous state on any error
      if (previousCart) {
        setCart(previousCart);
        saveToLocalStorage(previousCart.items);
      }

      console.error("Failed to add to cart:", error);
      showError(
        "Failed to Add Item",
        "Network error - changes have been reverted. Please try again."
      );
    }
  };

  const removeFromCart = async (productId: string) => {
    // Store previous cart state for rollback
    const previousCart = cart ? { ...cart, items: [...cart.items] } : null;

    try {
      if (!cart || !previousCart) return;

      // OPTIMISTIC UPDATE: Remove from UI immediately
      const updatedItems = cart.items.filter(
        (item) => item.productId !== productId
      );

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + (item.price || 0) * item.quantity,
        0
      );
      const newCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      const optimisticCart = {
        items: updatedItems,
        total: newTotal,
        count: newCount,
      };
      setCart(optimisticCart);
      saveToLocalStorage(updatedItems);

      // Show immediate success feedback
      showSuccess("Item Removed", "Item removed from cart successfully");

      if (user) {
        // Background server request
        const item = previousCart.items.find(
          (item) => item.productId === productId
        );
        if (item?.id) {
          const token = await user.getIdToken();
          const response = await fetch(`/api/cart/${item.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });

          if (response.ok) {
            // Sync with server data to get accurate cart state
            await fetchCart();
          } else {
            // ROLLBACK: Restore previous state on server error
            setCart(previousCart);
            saveToLocalStorage(previousCart.items);

            const errorData = await response.json().catch(() => ({}));
            showError(
              "Failed to Remove",
              errorData.message ||
                "Server error - item has been restored to cart"
            );
          }
        }
      }
    } catch (error) {
      // ROLLBACK: Restore previous state on any error
      if (previousCart) {
        setCart(previousCart);
        saveToLocalStorage(previousCart.items);
      }

      console.error("Failed to remove from cart:", error);
      showError(
        "Failed to Remove",
        "Network error - item has been restored to cart. Please try again."
      );
    }
  };

  const increaseQuantity = async (productId: string) => {
    // Store previous cart state for rollback
    const previousCart = cart ? { ...cart, items: [...cart.items] } : null;

    try {
      if (!cart || !previousCart) return;

      // OPTIMISTIC UPDATE: Increase quantity in UI immediately
      const updatedItems = cart.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + (item.price || 0) * item.quantity,
        0
      );
      const newCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      const optimisticCart = {
        items: updatedItems,
        total: newTotal,
        count: newCount,
      };
      setCart(optimisticCart);
      saveToLocalStorage(updatedItems);

      if (user) {
        // Background server request
        const item = previousCart.items.find(
          (item) => item.productId === productId
        );
        if (item?.id) {
          const token = await user.getIdToken();
          const response = await fetch(`/api/cart/${item.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify({ quantity: item.quantity + 1 }),
          });

          if (response.ok) {
            // Sync with server data to get accurate cart state
            await fetchCart();
          } else {
            // ROLLBACK: Restore previous state on server error
            setCart(previousCart);
            saveToLocalStorage(previousCart.items);

            const errorData = await response.json().catch(() => ({}));
            showError(
              "Update Failed",
              errorData.message ||
                "Failed to update quantity - changes reverted"
            );
          }
        }
      }
    } catch (error) {
      // ROLLBACK: Restore previous state on any error
      if (previousCart) {
        setCart(previousCart);
        saveToLocalStorage(previousCart.items);
      }

      console.error("Failed to increase quantity:", error);
      showError(
        "Update Failed",
        "Network error - quantity change has been reverted. Please try again."
      );
    }
  };

  const decreaseQuantity = async (productId: string) => {
    // Store previous cart state for rollback
    const previousCart = cart ? { ...cart, items: [...cart.items] } : null;

    try {
      if (!cart || !previousCart) return;

      // Check if item quantity is greater than 1
      const currentItem = cart.items.find(
        (item) => item.productId === productId
      );
      if (!currentItem || currentItem.quantity <= 1) return;

      // OPTIMISTIC UPDATE: Decrease quantity in UI immediately
      const updatedItems = cart.items.map((item) =>
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + (item.price || 0) * item.quantity,
        0
      );
      const newCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      const optimisticCart = {
        items: updatedItems,
        total: newTotal,
        count: newCount,
      };
      setCart(optimisticCart);
      saveToLocalStorage(updatedItems);

      if (user) {
        // Background server request
        const item = previousCart.items.find(
          (item) => item.productId === productId
        );
        if (item?.id && item.quantity > 1) {
          const token = await user.getIdToken();
          const response = await fetch(`/api/cart/${item.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify({ quantity: item.quantity - 1 }),
          });

          if (response.ok) {
            // Sync with server data to get accurate cart state
            await fetchCart();
          } else {
            // ROLLBACK: Restore previous state on server error
            setCart(previousCart);
            saveToLocalStorage(previousCart.items);

            const errorData = await response.json().catch(() => ({}));
            showError(
              "Update Failed",
              errorData.message ||
                "Failed to update quantity - changes reverted"
            );
          }
        }
      }
    } catch (error) {
      // ROLLBACK: Restore previous state on any error
      if (previousCart) {
        setCart(previousCart);
        saveToLocalStorage(previousCart.items);
      }

      console.error("Failed to decrease quantity:", error);
      showError(
        "Update Failed",
        "Network error - quantity change has been reverted. Please try again."
      );
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        const token = await user.getIdToken();
        const response = await fetch("/api/cart", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

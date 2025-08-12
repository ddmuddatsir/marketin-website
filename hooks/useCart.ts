import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import { Cart } from "@/types/cart";
import { cartAPI, externalApiClient } from "@/lib/api/client";

export function useCart() {
  const { user, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user || authLoading) return;

    setLoading(true);
    try {
      const res = await cartAPI.get();
      setCart(res.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) {
      showError("Authentication Required", "Please login to add items to cart");
      return;
    }

    try {
      // First, fetch product details from DummyJSON API
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

      // Send complete product data to cart API
      await cartAPI.add({
        productId: productId.toString(),
        quantity,
        price: product.price,
        name: product.title,
        image: product.thumbnail || product.images?.[0],
      });

      // Show success notification with action
      showSuccess(
        "Added to Cart! 🛒",
        `${quantity} item${quantity > 1 ? "s" : ""} added successfully`,
        {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        }
      );

      fetchCart();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        showError(
          "Authentication Required",
          "Please login to add items to cart"
        );
      } else if (axios.isAxiosError(error) && error.response?.status === 400) {
        showError(
          "Invalid Product",
          "The product information is invalid. Please try again."
        );
      } else {
        showError(
          "Failed to Add Item",
          "There was an error adding the item to your cart. Please try again."
        );
      }
    }
  };

  const orderNow = async (productId: string, quantity = 1) => {
    if (!user) {
      showError("Authentication Required", "Please login to place an order");
      return false;
    }

    try {
      // Show success notification for order
      showSuccess(
        "Order Initiated! 🚀",
        `${quantity} item${
          quantity > 1 ? "s" : ""
        } ready for checkout. Redirecting...`,
        {
          label: "Continue Shopping",
          onClick: () => router.push("/products"),
        }
      );

      // Redirect to checkout with specific product
      router.push(`/checkout?product=${productId}&quantity=${quantity}`);
      return true;
    } catch (error) {
      console.error("Failed to initiate order:", error);
      showError(
        "Failed to Process Order",
        "There was an error processing your order. Please try again."
      );
      return false;
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) {
      alert("Please login to remove items from cart");
      return;
    }

    try {
      await cartAPI.remove(productId);
      showSuccess("Removed from Cart", "Item removed successfully");
      fetchCart();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        showError(
          "Authentication Required",
          "Please login to remove items from cart"
        );
      } else {
        showError(
          "Failed to Remove Item",
          "There was an error removing the item from your cart."
        );
      }
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setCart(null);
      return;
    }

    const loadCart = async () => {
      setLoading(true);
      try {
        const res = await cartAPI.get();
        setCart(res.data);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setCart(null);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user, authLoading]); // Hanya depend pada user dan authLoading

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) {
      showError("Authentication Required", "Please login to update cart");
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      // First, fetch current cart item details
      const currentCartItem = cart?.items?.find(
        (item) => item.productId === productId
      );
      if (!currentCartItem) {
        showError("Item Not Found", "The item is not in your cart anymore.");
        return;
      }

      // Send update request with current product details
      await cartAPI.add({
        productId: productId.toString(),
        quantity,
        price: currentCartItem.product?.price || currentCartItem.price,
        name: currentCartItem.product?.title || currentCartItem.name,
        image: currentCartItem.product?.thumbnail || currentCartItem.image,
      });

      fetchCart();
    } catch (error) {
      console.error("Failed to update quantity:", error);
      showError(
        "Failed to Update Quantity",
        "There was an error updating the quantity. Please try again."
      );
    }
  };

  const increaseQuantity = async (productId: string) => {
    const currentItem = cart?.items?.find(
      (item) => item.productId === productId
    );
    if (currentItem) {
      await updateQuantity(productId, currentItem.quantity + 1);
    }
  };

  const decreaseQuantity = async (productId: string) => {
    const currentItem = cart?.items?.find(
      (item) => item.productId === productId
    );
    if (currentItem && currentItem.quantity > 1) {
      await updateQuantity(productId, currentItem.quantity - 1);
    } else if (currentItem) {
      await removeFromCart(productId);
    }
  };

  return {
    cart,
    loading,
    addToCart,
    orderNow,
    removeFromCart,
    fetchCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
  };
}

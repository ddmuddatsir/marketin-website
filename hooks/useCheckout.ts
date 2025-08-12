"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useAddresses } from "@/hooks/useAddresses";
import { useToast } from "@/contexts/ToastContext";
import { externalApiClient, ordersAPI } from "@/lib/api/client";
import { Product } from "@/types/product";

export function useCheckout() {
  const { cart } = useCart();
  const { addresses, addAddress, fetchAddresses } = useAddresses();
  const { showSuccess, showError } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Direct order states
  const productId = searchParams.get("product");
  const quantity = parseInt(searchParams.get("quantity") || "1");
  const [directProduct, setDirectProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  // Regular states
  const [addressId, setAddressId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Auth protection
  useEffect(() => {
    if (!authLoading && !user && !hasRedirected) {
      setHasRedirected(true);
      router.replace("/login?callbackUrl=" + encodeURIComponent("/checkout"));
    }
  }, [authLoading, user, router, hasRedirected]);

  // Set default address
  useEffect(() => {
    if (addresses.length > 0 && !addressId) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setAddressId(def.id);
    }
  }, [addresses, addressId]);

  // Fetch direct product
  useEffect(() => {
    const fetchDirectProduct = async () => {
      if (productId) {
        setLoadingProduct(true);
        try {
          const response = await externalApiClient.get(
            `/products/${productId}`
          );
          const product = response.data;
          setDirectProduct({
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            image: product.thumbnail || product.images?.[0],
            images: product.images,
            description: product.description,
            brand: product.brand,
            category: product.category,
          });
        } catch (error) {
          console.error("Failed to fetch product:", error);
          setError("Failed to load product details");
        } finally {
          setLoadingProduct(false);
        }
      }
    };

    fetchDirectProduct();
  }, [productId]);

  // Determine order type and items
  const isDirectOrder = productId && directProduct;
  const items = isDirectOrder
    ? [
        {
          id: `direct-${directProduct.id}`,
          productId: directProduct.id,
          quantity: quantity,
          product: directProduct,
        },
      ]
    : cart?.items || [];

  const total = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  // Handle order submission
  const handleOrder = async () => {
    if (!addressId) {
      showError("Address Required", "Please select a shipping address");
      return;
    }

    if (!user) {
      showError("Authentication Required", "Please login to place an order");
      return;
    }

    if (!items || items.length === 0) {
      showError(
        "Empty Cart",
        "Your cart is empty. Please add items before placing an order."
      );
      return;
    }

    const invalidItems = items.filter(
      (item) =>
        !item.product?.id ||
        !item.product?.title ||
        !item.product?.price ||
        item.quantity <= 0
    );

    if (invalidItems.length > 0) {
      showError(
        "Invalid Cart Items",
        "Some items in your cart have invalid data. Please refresh and try again."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderItems = items
        .filter((item) => item.product?.id)
        .map((item) => ({
          productId: item.product!.id.toString(),
          quantity: item.quantity,
          price: item.product!.price,
          name: item.product!.title,
        }));

      if (orderItems.length === 0) {
        showError("Invalid Order", "No valid items found in your order");
        return;
      }

      const orderData = {
        addressId: addressId!,
        items: orderItems,
        total,
        paymentMethod: "COD",
      };

      const result = await ordersAPI.create(orderData);

      showSuccess(
        "Order Placed Successfully! 🎉",
        `Order #${result.data.orderId} has been confirmed. You will receive an email confirmation shortly.`
      );

      setTimeout(() => {
        router.push("/order-success");
      }, 2000);
    } catch (error) {
      console.error("Order error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Order failed. Please try again.";
      showError("Order Failed", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    // States
    user,
    authLoading,
    addresses,
    addressId,
    setAddressId,
    directProduct,
    loadingProduct,
    isDirectOrder,
    items,
    total,
    error,
    loading,

    // Actions
    handleOrder,
    addAddress,
    fetchAddresses,
  };
}

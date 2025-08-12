"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/types/product";
import { OrderDetail, OrderItem } from "@/types/order";
import { ordersAPI, externalApiClient } from "@/lib/api/client";

export function useOrderDetail(orderId: string) {
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productCache, setProductCache] = useState<{ [key: string]: Product }>(
    {}
  );

  useEffect(() => {
    const fetchProductDetails = async (
      productId: string
    ): Promise<Product | null> => {
      if (productCache[productId]) {
        return productCache[productId];
      }

      try {
        const response = await externalApiClient.get(`/products/${productId}`);
        const product = response.data;
        setProductCache((prev) => ({ ...prev, [productId]: product }));
        return product;
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
      return null;
    };

    const fetchOrderDetails = async () => {
      if (!user || !orderId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let orderData;

        try {
          const response = await ordersAPI.getById(orderId);
          orderData = response.data;
        } catch (error) {
          console.log("Trying legacy endpoint...", error);
          const response = await ordersAPI.getByIdLegacy(orderId);
          orderData = response.data;
        }

        if (orderData) {
          setOrder(orderData);

          if (orderData.items) {
            orderData.items.forEach(async (item: OrderItem) => {
              if (item.productId) {
                const productData = await fetchProductDetails(item.productId);
                if (productData) {
                  setOrder((prevOrder) => {
                    if (!prevOrder) return null;
                    return {
                      ...prevOrder,
                      items: prevOrder.items.map((orderItem) =>
                        orderItem.id === item.id
                          ? { ...orderItem, productData }
                          : orderItem
                      ),
                    };
                  });
                }
              }
            });
          }
        } else {
          setError("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [user, orderId, productCache]);

  return { order, loading, error };
}

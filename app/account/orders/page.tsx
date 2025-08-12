"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AccountLayout } from "@/components/account/AccountLayout";
import { OrdersHeader } from "@/components/account/OrdersHeader";
import { OrdersEmptyState } from "@/components/account/OrdersEmptyState";
import { OrdersLoadingState } from "@/components/account/OrdersLoadingState";
import { OrdersGrid } from "@/components/account/OrdersGrid";
import { OrdersStats } from "@/components/account/OrdersStats";
import { Product } from "@/types/product";
import { Order, OrderItem } from "@/types/order";
import { ordersAPI, externalApiClient } from "@/lib/api/client";

// Disable static generation for auth-required pages
export const dynamic = "force-dynamic";

export default function OrdersPage() {
  return (
    <AccountLayout>
      <div className="p-6">
        <OrdersContent />
      </div>
    </AccountLayout>
  );
}

function OrdersContent() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [productCache, setProductCache] = useState<{ [key: string]: Product }>(
    {}
  );

  //  Stable fetchProductDetails with proper caching
  const fetchProductDetails = useCallback(
    async (productId: string): Promise<Product | null> => {
      try {
        const response = await externalApiClient.get(`/products/${productId}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch product ${productId}:`, error);
      }
      return null;
    },
    []
  ); //  Empty dependencies to prevent re-creation

  //  Fetch orders and product details together
  useEffect(() => {
    async function fetchOrdersAndProducts() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const ordersResponse = await ordersAPI.getAll();
        const ordersData = ordersResponse.data;
        console.log("Orders fetched:", ordersData.length); // Debug log
        setOrders(ordersData);

        // Extract all unique product IDs
        const allItems = ordersData.flatMap((order: Order) => order.items);
        const productIds = allItems
          .map((item: OrderItem) => item.productId)
          .filter(
            (id: unknown): id is string =>
              typeof id === "string" && id.length > 0
          );

        const uniqueProductIds = [...new Set(productIds)] as string[];
        console.log("Found unique product IDs:", uniqueProductIds.length);

        if (uniqueProductIds.length > 0) {
          // Fetch all products in parallel
          const productPromises = uniqueProductIds.map(
            async (productId: string) => {
              const product = await fetchProductDetails(productId);
              return { productId, product };
            }
          );

          const results = await Promise.all(productPromises);

          // Build product cache
          const newProducts: { [key: string]: Product } = {};
          results.forEach(({ productId, product }) => {
            if (product) {
              newProducts[productId] = product;
            }
          });

          setProductCache(newProducts);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrdersAndProducts();
  }, [user, fetchProductDetails]); //  Only depend on user and stable function

  //  Memoize product orders to avoid re-computation
  const allProductOrders = useMemo(() => {
    return orders.flatMap((order) =>
      order.items.map((item, itemIndex) => ({
        ...item,
        orderId: order.id,
        orderStatus: order.status,
        orderDate: order.createdAt,
        productData: item.productId ? productCache[item.productId] : undefined,
        // Add a unique identifier for React keys
        uniqueId: `${order.id}-${
          item.id || item.productId || "item"
        }-${itemIndex}`,
      }))
    );
  }, [orders, productCache]);

  //  Loading state with proper message
  if (loading) {
    return <OrdersLoadingState />;
  }

  //  Empty state
  if (!orders.length) {
    return <OrdersEmptyState />;
  }

  return (
    <div>
      <OrdersHeader totalOrders={orders.length} />
      <OrdersGrid orders={allProductOrders} />
      {allProductOrders.length > 0 && (
        <OrdersStats orders={orders} totalItems={allProductOrders.length} />
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export function Orders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || authLoading) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/orders", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  };

  if (authLoading || loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Please login to view your orders
            </p>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-4">
              You haven&apos;t placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Orders</h2>

      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  Order #{order.id.slice(-8)}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Placed {formatDate(order.createdAt)}
                </p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  Total: ${order.total.toFixed(2)}
                </span>
                <span className="text-sm text-gray-600">
                  {order.items.length} item{order.items.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-2">
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>
                      {item.quantity}x ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="text-sm text-gray-600">
                    +{order.items.length - 2} more item
                    {order.items.length - 2 > 1 ? "s" : ""}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-600">
                  Payment: {order.paymentMethod || "Cash on Delivery"}
                </span>
                <Link href={`/account/orders/${order.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

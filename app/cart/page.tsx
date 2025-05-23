"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

interface Cart {
  id: number;
  products: Product[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export default function CartPage() {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCarts() {
      try {
        const res = await fetch("https://dummyjson.com/carts");
        if (!res.ok) throw new Error("Failed to fetch carts");
        const data = await res.json();
        setCarts(data.carts);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      }
    }
    fetchCarts();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-8 text-muted-foreground">Loading carts...</p>
    );
  if (error)
    return (
      <p className="text-center mt-8 text-red-600 font-semibold">{error}</p>
    );

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-center">
        Shopping Carts
      </h1>

      {carts.length === 0 && <p>No carts available.</p>}

      <div className="flex flex-col space-y-8">
        {carts.map((cart) => (
          <Card key={cart.id} className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Cart #{cart.id}</span>
                <Badge variant="secondary">User ID: {cart.userId}</Badge>
              </CardTitle>
              <CardDescription className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                <span>Total Products: {cart.totalProducts}</span>
                <span>Total Quantity: {cart.totalQuantity}</span>
                <span>Total Price: ${cart.total.toFixed(2)}</span>
                <span>
                  Discounted Total: ${cart.discountedTotal.toFixed(2)}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ScrollArea className="h-[320px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {cart.products.map((product) => (
                    <Card
                      key={product.id}
                      className="flex flex-col sm:flex-row items-center gap-4 p-4"
                    >
                      <div className="relative w-28 h-28 flex-shrink-0">
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <h3 className="font-semibold text-lg">
                          {product.title}
                        </h3>
                        <p>
                          Price:{" "}
                          <span className="font-medium">
                            ${product.price.toFixed(2)}
                          </span>
                        </p>
                        <p>Quantity: {product.quantity}</p>
                        <p>
                          Total:{" "}
                          <span className="font-medium">
                            ${product.total.toFixed(2)}
                          </span>
                        </p>
                        <p className="text-green-600 text-sm">
                          Discount: {product.discountPercentage.toFixed(2)}%
                        </p>
                        <p>
                          Discounted Total:{" "}
                          <span className="font-semibold">
                            ${product.discountedTotal.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, use } from "react";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  thumbnail: string;
  images: string[];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      const productData: Product = await res.json();

      const relatedRes = await fetch(
        `https://dummyjson.com/products/category/${productData.category}`
      );
      const relatedData = await relatedRes.json();
      const filteredRelated: Product[] = relatedData.products.filter(
        (p: Product) => p.id !== productData.id
      );

      setProduct(productData);
      setRelatedProducts(filteredRelated);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        Loading product details...
      </div>
    );
  }

  const handleBuyNow = () => {
    // Arahkan ke halaman checkout atau tambahkan ke cart
  };

  const handleWishlist = () => {
    // Kirim ke API atau update state wishlist
  };

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-12">
      <div>Product ID: {id}</div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Gambar */}
        <Card className="md:w-1/2">
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={600}
            height={600}
            className="rounded-xl object-cover w-full h-auto"
            priority
          />
          {/* Thumbnail gallery jika ingin */}
          <ScrollArea className="mt-4 flex gap-4">
            {product.images.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={`${product.title} - ${i}`}
                width={100}
                height={100}
                className="rounded cursor-pointer object-cover"
              />
            ))}
          </ScrollArea>
        </Card>

        {/* Detail */}
        <section className="md:w-1/2 space-y-4">
          <Card>
            <CardContent className="space-y-3">
              <h1 className="text-4xl font-extrabold">{product.title}</h1>

              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold">
                  ${product.price.toFixed(2)}
                </h3>
                <Badge variant="destructive" className="text-sm">
                  -{product.discountPercentage}%
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-yellow-500 font-semibold">
                <span>⭐</span>
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <p className="text-muted-foreground">{product.description}</p>

              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary">Brand: {product.brand}</Badge>
                <Badge variant="secondary">Category: {product.category}</Badge>
                <Badge variant="secondary">SKU: {product.sku}</Badge>
                <Badge variant="secondary">Stock: {product.stock}</Badge>
              </div>

              <Separator />

              <p>
                <strong>Availability:</strong> {product.availabilityStatus}
              </p>
              <p>
                <strong>Minimum Order Quantity:</strong>{" "}
                {product.minimumOrderQuantity}
              </p>
              <p>
                <strong>Shipping Info:</strong> {product.shippingInformation}
              </p>
              <p>
                <strong>Return Policy:</strong> {product.returnPolicy}
              </p>

              <Separator />

              <div className="flex gap-4">
                <Button variant="outline" size="lg" className=" items-center">
                  <FaHeart className="text-pink-500" />
                </Button>
                <Button size="lg" className="w-full flex items-center gap-2">
                  <FaShoppingCart className="text-white" />
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full flex items-center gap-2"
                >
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Reviews */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4">
            {product.reviews.map((review, i) => (
              <Card key={i} className="bg-gray-50 p-4">
                <CardHeader className="flex justify-between items-center p-0 mb-2">
                  <CardTitle className="text-lg font-semibold">
                    {review.reviewerName}
                  </CardTitle>
                  <Badge variant="secondary">{review.rating} ⭐</Badge>
                </CardHeader>
                <CardDescription>{review.comment}</CardDescription>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Related Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedProducts.slice(0, 6).map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="border rounded-lg p-4 hover:shadow-md transition bg-white"
            >
              <Image
                src={p.thumbnail}
                alt={p.title}
                width={300}
                height={200}
                className="rounded-md object-cover w-full h-40"
              />
              <h3 className="mt-2 font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-600">${p.price.toFixed(2)}</p>
              <p className="text-xs text-yellow-500">
                ⭐ {p.rating.toFixed(1)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

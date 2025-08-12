"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaTruck,
  FaUndo,
  FaShieldAlt,
} from "react-icons/fa";
import { ProductId } from "@/types/productId";
import Image from "next/image";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useHandleToCart } from "@/hooks/useHandleToCart";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";

interface ProductDetailProps {
  product: ProductId;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(product.thumbnail);
  const { handleAddToCart } = useHandleToCart();
  const { wishlist, addToWishlist, removeFromWishlist, loading } =
    useWishlist();

  // Check if product is in wishlist
  const isWishlisted =
    wishlist?.items?.some((item) => item.productId === product.id.toString()) ||
    false;

  const handleWishlist = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id.toString());
      } else {
        await addToWishlist(product.id.toString());
      }
    } catch (error) {
      console.error("Error handling wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10">
      {/* Image Gallery */}
      <Card className="md:w-1/2">
        <div className="relative aspect-square">
          <Image
            src={selectedImage}
            alt={product.title}
            fill
            className="rounded-t-xl object-cover"
            priority
          />
        </div>
        <ScrollArea className="p-4">
          <div className="flex gap-4">
            {[product.thumbnail, ...product.images].map((img, i) => (
              <div
                key={i}
                className={cn(
                  "relative w-20 h-20 rounded-lg cursor-pointer border-2 transition-all",
                  selectedImage === img
                    ? "border-primary"
                    : "border-transparent"
                )}
                onClick={() => setSelectedImage(img)}
              >
                <Image
                  src={img}
                  alt={`${product.title} - ${i}`}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Product Info */}
      <section className="md:w-1/2 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10",
                isWishlisted && "text-pink-500 hover:text-pink-600",
                loading && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleWishlist}
              disabled={loading}
            >
              {isWishlisted ? (
                <FaHeart className="h-5 w-5 fill-current" />
              ) : (
                <FaRegHeart className="h-5 w-5" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              <span className="font-semibold">{product.rating.toFixed(1)}</span>
            </div>
            <Badge variant="secondary">{product.brand}</Badge>
            <Badge variant="secondary">{product.category}</Badge>
          </div>

          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl font-bold">${product.price.toFixed(2)}</h2>
            {product.discountPercentage > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="text-sm">
                  -{product.discountPercentage}%
                </Badge>
                <span className="text-muted-foreground line-through">
                  $
                  {(
                    product.price *
                    (1 + product.discountPercentage / 100)
                  ).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>
        </div>

        <Separator />

        {/* Product Details Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">SKU</p>
                <p className="font-medium">{product.sku}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Stock</p>
                <p className="font-medium">{product.stock} units</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="font-medium">{product.weight} kg</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Dimensions</p>
                <p className="font-medium">
                  {product.dimensions.width}x{product.dimensions.height}x
                  {product.dimensions.depth} cm
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="space-y-4">
            <div className="flex items-start gap-3">
              <FaTruck className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Shipping Information</h3>
                <p className="text-muted-foreground">
                  {product.shippingInformation}
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="returns" className="space-y-4">
            <div className="flex items-start gap-3">
              <FaUndo className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Return Policy</h3>
                <p className="text-muted-foreground">{product.returnPolicy}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full">
            <FaShoppingCart className="mr-2 h-5 w-5" />
            Buy Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => handleAddToCart(product.id.toString())}
          >
            Add to Cart
          </Button>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FaShieldAlt className="h-4 w-4" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <FaTruck className="h-4 w-4" />
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUndo className="h-4 w-4" />
            <span>Easy Returns</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;

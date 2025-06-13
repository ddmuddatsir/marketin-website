import React from "react";
import { Button } from "../ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { ProductId } from "@/types/productId";
import Image from "next/image";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useHandleToCart } from "@/hooks/useHandleToCart";

interface DetailProductProps {
  product: ProductId;
}

const DetailProduct = ({ product }: DetailProductProps) => {
  const { handleAddToCart } = useHandleToCart();

  return (
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
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default DetailProduct;

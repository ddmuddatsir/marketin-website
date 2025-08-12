"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { FaStar, FaTruck, FaUndo, FaShieldAlt, FaCheck } from "react-icons/fa";
import { ProductId } from "@/types/productId";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import WishlistButton from "../wishlist/WishlistButton";

export default function DetailProduct({ product }: { product: ProductId }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const { addToCart, orderNow } = useCart();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-6">
          <div className="aspect-square relative overflow-hidden rounded-lg border bg-muted">
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              className="object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((image) => (
              <button
                key={image}
                onClick={() => setSelectedImage(image)}
                className={`aspect-square relative overflow-hidden rounded-lg border bg-muted ${
                  selectedImage === image
                    ? "ring-2 ring-primary"
                    : "hover:opacity-75"
                }`}
              >
                <Image
                  src={image}
                  alt={product.title}
                  fill
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-8 justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{product.title}</h1>
            </div>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span className="font-semibold">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <Badge variant="secondary">{product.brand}</Badge>
              <Badge variant="secondary">{product.category}</Badge>
            </div>
            <div className="flex items-baseline gap-3 mb-2">
              <h2 className="text-3xl font-bold">
                ${product.price.toFixed(2)}
              </h2>
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
            <p className="text-muted-foreground text-base leading-relaxed mb-2">
              {product.description}
            </p>
          </div>

          {/* Simple Info Bar */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-6 mt-2">
            <div className="flex items-center gap-3 bg-gray-50 rounded px-3 py-2">
              <FaTruck className="h-5 w-5 text-blue-600" />
              <div>
                <span className="font-semibold">Free Shipping</span>
                <span className="block text-xs text-gray-500">
                  On orders over $50
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded px-3 py-2">
              <FaUndo className="h-5 w-5 text-green-600" />
              <div>
                <span className="font-semibold">Easy Returns</span>
                <span className="block text-xs text-gray-500">
                  30 day return policy
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded px-3 py-2">
              <FaShieldAlt className="h-5 w-5 text-purple-600" />
              <div>
                <span className="font-semibold">Secure Payment</span>
                <span className="block text-xs text-gray-500">
                  100% secure checkout
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
              onClick={() => addToCart(String(product.id))}
            >
              Add to Cart
            </button>
            <button
              className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
              onClick={async () => {
                await orderNow(String(product.id));
              }}
            >
              Order Now
            </button>
            <WishlistButton productId={String(product.id)} />
          </div>
        </div>
      </div>

      {/* Product Details - Vertical Layout */}
      <div className="mt-14 space-y-8">
        {/* Description Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Product Description
          </h2>
          <p className="text-base leading-relaxed text-gray-700">
            {product.description}
          </p>
        </div>

        {/* Specifications Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 min-w-[80px]">Brand:</span>
                <span className="font-medium text-gray-800">
                  {product.brand}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 min-w-[80px]">Category:</span>
                <span className="font-medium text-gray-800">
                  {product.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 min-w-[80px]">SKU:</span>
                <span className="font-medium text-gray-800">{product.sku}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 min-w-[80px]">Weight:</span>
                <span className="font-medium text-gray-800">
                  {product.weight} kg
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 min-w-[80px]">Width:</span>
                <span className="font-medium text-gray-800">
                  {product.dimensions.width} cm
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 min-w-[80px]">Height:</span>
                <span className="font-medium text-gray-800">
                  {product.dimensions.height} cm
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 min-w-[80px]">Depth:</span>
                <span className="font-medium text-gray-800">
                  {product.dimensions.depth} cm
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Returns Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Shipping & Returns
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                Shipping Information
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.shippingInformation}
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                Return Policy
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.returnPolicy}
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                Warranty Information
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.warrantyInformation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

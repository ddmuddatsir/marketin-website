import { useProductCategory } from "@/hooks/useProduct";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface RelatedProductProps {
  category: string;
  excludeId: number;
}

const RelatedProduct: React.FC<RelatedProductProps> = ({
  category,
  excludeId,
}) => {
  const { data, isLoading, error } = useProductCategory(category, excludeId);

  if (isLoading || !category) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        Loading related products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load related products.
      </div>
    );
  }

  const products = data?.products ?? [];

  if (products.length === 0) {
    return null;
  }

  return (
    <div>
      <section>
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="border rounded-lg p-4 hover:shadow-md transition bg-white"
            >
              <Image
                src={product.thumbnail || product.image || "/placeholder.png"}
                alt={product.title}
                width={300}
                height={200}
                className="rounded-md object-cover w-full h-40"
              />
              <h3 className="mt-2 font-semibold">{product.title}</h3>
              <p className="text-sm text-gray-600">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-xs text-yellow-500">
                ⭐ {product.rating ? product.rating.toFixed(1) : "N/A"}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RelatedProduct;

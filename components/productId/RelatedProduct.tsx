import { fetchProductByCategory } from "@/lib/api/product";
import { useQuery } from "@tanstack/react-query";
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
  const {
    data: relatedProducts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["relatedProducts", category],
    queryFn: () => fetchProductByCategory(category, excludeId),
    enabled: !!category,
  });

  if (isLoading || !category) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load product details.
      </div>
    );
  }
  return (
    <div>
      <section>
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedProducts.slice(0, 6).map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="border rounded-lg p-4 hover:shadow-md transition bg-white"
            >
              <Image
                src={product.thumbnail}
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
                ⭐ {product.rating.toFixed(1)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RelatedProduct;

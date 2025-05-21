import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;

  const res = await fetch(
    `https://dummyjson.com/products/category/${category}`
  );
  if (!res.ok) return notFound();
  const data = await res.json();
  const products: Product[] = data.products;

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        Category: {category.replace("-", " ")}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-2xl p-4 shadow hover:shadow-lg transition"
            >
              <Link href={`/products/${product.id}`}>
                <div>
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-xl"
                    />
                  </div>
                  <h2 className="text-lg font-semibold truncate">
                    {product.title}
                  </h2>
                  <p className="text-sm text-gray-500 truncate">
                    {product.brand}
                  </p>
                  <p className="text-sm">${product.price}</p>
                  <p className="text-xs text-yellow-600">⭐ {product.rating}</p>
                  <p className="text-xs text-red-500">Stock: {product.stock}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

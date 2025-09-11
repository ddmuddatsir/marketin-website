import Link from "next/link";
import { notFound } from "next/navigation";
import ReviewProduct from "@/components/productId/ReviewProduct";
import RelatedProduct from "@/components/productId/RelatedProduct";
import DetailProduct from "@/components/productId/DetailProduct";
import { ProductId } from "@/types/productId";
import { externalApiClient } from "@/lib/api/client";
import { Product } from "@/types/product";

// ISR - Revalidate every 30 minutes
export const revalidate = 1800;

// Server-side data fetching
async function fetchProduct(id: string): Promise<ProductId | null> {
  try {
    const response = await externalApiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

// Generate static params for popular products (ISR)
export async function generateStaticParams() {
  try {
    // Fetch first 20 products for static generation
    const response = await externalApiClient.get("/products?limit=20");
    const products = response.data.products || [];

    return products.map((product: Product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = await fetchProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">{product.title}</li>
        </ol>
      </nav>

      {/* Product Detail */}
      <DetailProduct product={product as ProductId} />

      {/* Reviews */}
      <ReviewProduct reviews={product.reviews} />

      {/* Related Products */}
      {product.category && (
        <RelatedProduct
          category={product.category}
          excludeId={
            typeof product.id === "string" ? parseInt(product.id) : product.id
          }
        />
      )}
    </main>
  );
}

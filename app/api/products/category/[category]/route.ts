import { NextRequest, NextResponse } from "next/server";

interface DummyJSONProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  brand?: string;
  category: string;
  rating: number;
  stock: number;
  discountPercentage: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const { category } = params;

    if (!category) {
      return NextResponse.json(
        { error: "Category parameter is required" },
        { status: 400 }
      );
    }

    // Fetch from DummyJSON API
    const response = await fetch(
      `https://dummyjson.com/products/category/${category}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Transform the response to match our expected format
    const products = data.products.map((product: DummyJSONProduct) => ({
      id: product.id.toString(),
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.thumbnail,
      thumbnail: product.thumbnail,
      brand: product.brand || product.category,
      category: product.category,
      rating: product.rating,
      stock: product.stock,
      discountPercentage: product.discountPercentage,
    }));

    return NextResponse.json({
      products,
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import axios from "axios";
import { DummyResponse } from "@/types/product";

const DUMMY_JSON_API = "https://dummyjson.com/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const query = searchParams.get("query") || searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build the API URL
    let apiUrl = `${DUMMY_JSON_API}?limit=${limit}&skip=${skip}`;
    if (query) {
      apiUrl = `${DUMMY_JSON_API}/search?q=${encodeURIComponent(
        query
      )}&limit=${limit}&skip=${skip}`;
    }

    console.log("Fetching products from:", apiUrl);

    const { data } = await axios.get<DummyResponse>(apiUrl);

    // Transform the response to match our expected format
    const products = data.products.map((product) => ({
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

    const hasMore = skip + products.length < data.total;

    return NextResponse.json({
      products,
      total: data.total,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

import { Product, ProductsResponse } from "@/types/product";
import { Review } from "@/types/review";
import axios from "axios";

const api = axios.create({
  baseURL: "https://dummyjson.com",
});

export interface PaginatedProductsResponse extends ProductsResponse {
  nextSkip: number | undefined;
}

export const searchProducts = async ({
  query,
  pageParam = 0,
  limit = 10,
}: {
  query: string;
  pageParam?: number;
  limit?: number;
}): Promise<{ products: Product[]; nextSkip?: number }> => {
  try {
    const skip = pageParam * limit;
    const { data } = await api.get<ProductsResponse>(`/products/search`, {
      params: {
        q: query,
        limit,
        skip,
      },
    });

    if (!data || !data.products) {
      throw new Error("Invalid response format");
    }

    return {
      products: data.products,
      nextSkip: data.products.length < limit ? undefined : pageParam + 1,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to search products"
      );
    }
    throw error;
  }
};

export const getProducts = async (params: {
  limit?: number;
  skip?: number;
  category?: string;
}) => {
  const { data } = await api.get<ProductsResponse>("/products", { params });
  return data;
};

export interface ProductId extends Product {
  reviews: Review[];
  discountPercentage: number;
  tags: string[];
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
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
}

export const getProductById = async (id: number): Promise<ProductId> => {
  const { data } = await api.get<Product>(`/products/${id}`);
  // Add mock reviews since DummyJSON doesn't provide them
  const mockReviews: Review[] = [
    {
      rating: 4.5,
      comment: "Great product! Very satisfied with the quality.",
      date: new Date().toISOString(),
      reviewerName: "John Doe",
      reviewerEmail: "john@example.com",
    },
    {
      rating: 5,
      comment: "Excellent service and fast delivery.",
      date: new Date().toISOString(),
      reviewerName: "Jane Smith",
      reviewerEmail: "jane@example.com",
    },
  ];
  return {
    ...data,
    reviews: mockReviews,
    discountPercentage: 0,
    tags: [],
    sku: `SKU-${id}`,
    weight: 1,
    dimensions: {
      width: 10,
      height: 10,
      depth: 10,
    },
    warrantyInformation: "1 year warranty",
    shippingInformation: "Free shipping on orders over $50",
    availabilityStatus: "In Stock",
    returnPolicy: "30 days return policy",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      barcode: `BAR-${id}`,
      qrCode: `QR-${id}`,
    },
  };
};

export const getProductsByCategory = async (
  category: string,
  excludeId?: number
): Promise<ProductsResponse> => {
  try {
    const { data } = await axios.get<ProductsResponse>(
      `/api/products/category/${category}`
    );

    if (!data || !data.products) {
      throw new Error("Invalid response format");
    }

    return {
      ...data,
      products: excludeId
        ? data.products.filter((product) => Number(product.id) !== excludeId)
        : data.products,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch products by category"
      );
    }
    throw error;
  }
};

const LIMIT = 10;

// Get all products
export const fetchAllProducts = async ({
  pageParam = 0,
}): Promise<{ products: Product[]; nextSkip?: number }> => {
  const res = await axios.get(
    `https://dummyjson.com/products?limit=${LIMIT}&skip=${pageParam}`
  );

  // Transform products to ensure image field is set
  const transformedProducts = res.data.products.map((product: Product) => ({
    ...product,
    image: product.thumbnail, // Set image field for ProductCard compatibility
  }));

  return {
    products: transformedProducts,
    nextSkip:
      transformedProducts.length < LIMIT ? undefined : pageParam + LIMIT,
  };
};

export const fetchRecommended = async (limit = 10): Promise<Product[]> => {
  try {
    // Get products with high ratings (4.5 or above)
    const { data } = await api.get<ProductsResponse>("/products", {
      params: { limit: 100 }, // Fetch more to filter by rating
    });

    if (!data || !data.products) {
      throw new Error("Invalid response format");
    }

    const recommendedProducts = data.products
      .filter(
        (product) => product.rating !== undefined && product.rating >= 4.5
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit)
      .map((product) => ({
        ...product,
        image: product.thumbnail, // Set image field for ProductCard compatibility
      }));

    return recommendedProducts;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch recommended products"
      );
    }
    throw error;
  }
};

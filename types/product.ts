export interface ProductBase {
  id: string | number;
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
  image?: string;
  brand?: string;
  category?: string;
  rating?: number;
  stock?: number;
}

export interface Product extends ProductBase {
  discountPercentage?: number;
  images?: string[];
  availabilityStatus?: string;
  reviews?: Review[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  tags?: string[];
  weight?: number;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
  hasMore?: boolean;
}

export interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  brand?: string;
  category: string;
  rating?: number;
  stock?: number;
  discountPercentage?: number;
}

export interface DummyResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductSearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "rating" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ProductFilters {
  categories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
}

export type ProductEntity = {
  id: string | number;
  title: string;
  description: string;
  price: number;
};

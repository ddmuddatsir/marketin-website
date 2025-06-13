import { LIMIT } from "@/constants/home";
import { Product } from "@/types/product";
import { ProductId } from "@/types/productId";
import axios from "axios";

// Get all products
export const fetchAllProducts = async ({
  pageParam = 0,
}): Promise<{ products: Product[]; nextSkip?: number }> => {
  const res = await axios.get(
    `https://dummyjson.com/products?limit=${LIMIT}&skip=${pageParam}`
  );
  return {
    products: res.data.products,
    nextSkip: res.data.products.length < LIMIT ? undefined : pageParam + LIMIT,
  };
};

// Get products by recommended
export const fetchRecommended = async (): Promise<Product[]> => {
  const res = await axios.get("https://dummyjson.com/products?limit=100");
  const shuffled = res.data.products.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 20);
};

//Get products by [id]
export const fetchProductById = async (id: string): Promise<ProductId> => {
  const res = await axios.get(`https://dummyjson.com/products/${id}`);
  return res.data;
};

//Get products by categorie
export const fetchProductByCategory = async (
  category: string,
  excludeId: number
): Promise<ProductId[]> => {
  const res = await axios.get(
    `https://dummyjson.com/products/category/${category}`
  );
  return res.data.products.filter((p: ProductId) => p.id !== excludeId);
};

//Get products by categorie 2
export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const res = await axios.get(
    `https://dummyjson.com/products/category/${category}`
  );
  return res.data.products;
};

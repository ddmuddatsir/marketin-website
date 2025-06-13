import { fetchProductById, getProductsByCategory } from "@/lib/api/product";
import { useQuery } from "@tanstack/react-query";

// product by id
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
};

//product categories
export const useProductCategory = (category: string) => {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: () => getProductsByCategory(category),
    staleTime: 5 * 60 * 1000,
  });
};

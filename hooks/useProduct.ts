import { getProductById, getProductsByCategory } from "@/lib/api/product";
import { useQuery } from "@tanstack/react-query";

// product by id
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(Number(id)),
    enabled: !!id,
  });
};

//product categories
export const useProductCategory = (category: string, excludeId?: number) => {
  return useQuery({
    queryKey: ["products", "category", category, excludeId],
    queryFn: () => getProductsByCategory(category, excludeId),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

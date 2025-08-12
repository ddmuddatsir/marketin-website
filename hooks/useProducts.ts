import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Product, ProductsResponse } from "@/types/product";
import { productsAPI } from "@/lib/api/client";

const fetchProducts = async ({
  pageParam = 0,
  search = "",
}: {
  pageParam?: number;
  search?: string;
}): Promise<ProductsResponse> => {
  const limit = 10;
  const skip = pageParam * limit;

  const response = await productsAPI.getAll({
    search: search || undefined,
    limit,
    skip,
  });

  return response.data;
};

export const useProducts = (search?: string) => {
  return useInfiniteQuery({
    queryKey: ["products", search],
    queryFn: ({ pageParam }) => fetchProducts({ pageParam, search }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const skip = lastPage.skip ?? 0;
      const limit = lastPage.limit ?? 10;
      const total = lastPage.total ?? 0;

      if (skip + limit >= total) {
        return undefined;
      }
      return Math.floor(skip / limit) + 1;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await productsAPI.getById(id);
      return response.data as Product;
    },
    enabled: !!id,
  });
};

import { deleteCartById, fetchCartByUser, updateCart } from "@/lib/api/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetCartData = (userId: number) => {
  return useQuery({
    queryKey: ["cartData", userId],
    queryFn: () => fetchCartByUser(),
    enabled: !!userId,
  });
};

export const useCartMutations = (userId: number) => {
  const queryClient = useQueryClient();

  const invalidateCart = () => {
    queryClient.invalidateQueries({ queryKey: ["cart", userId] });
  };

  const updateMutation = useMutation({
    mutationFn: updateCart,
    onSuccess: invalidateCart,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCartById,
    onSuccess: invalidateCart,
  });

  return { updateMutation, deleteMutation };
};

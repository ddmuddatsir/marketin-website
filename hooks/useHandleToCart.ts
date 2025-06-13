import { ProductId } from "@/types/productId";
import { useAddToCart } from "./useAddToCart";

export const useHandleToCart = () => {
  const addToCartMutation = useAddToCart();

  const handleAddToCart = (product: ProductId | null) => {
    if (!product) return;

    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user || !user.id) {
      alert("User not found");
      return;
    }

    addToCartMutation.mutate({
      userId: user.id,
      productId: product.id,
      quantity: 1,
    });
  };

  return { handleAddToCart, isPending: addToCartMutation.isPending };
};

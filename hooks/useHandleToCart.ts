import { useAddToCart } from "./useAddToCart";

export const useHandleToCart = () => {
  const mutation = useAddToCart();

  const handleAddToCart = async (productId: string, quantity: number = 1) => {
    try {
      await mutation.mutateAsync({
        userId: 1, // Placeholder - will be replaced with actual user ID from Firebase
        productId: parseInt(productId),
        quantity,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  return {
    handleAddToCart,
    isLoading: mutation.isPending,
  };
};

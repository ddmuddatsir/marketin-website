import { addToCart } from "@/lib/api/cart";
import { useMutation } from "@tanstack/react-query";

export const useAddToCart = () => {
  return useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      console.log("Cart response:", data);
      alert("Item successfully added to cart!");
      localStorage.setItem("cart_response", JSON.stringify(data));
    },
    onError: (error) => {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart. Please try again.");
    },
  });
};

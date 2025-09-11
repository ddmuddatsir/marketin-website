import { addToCart } from "@/lib/api/cart";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

export const useAddToCart = () => {
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      console.log("Cart response:", data);
      showSuccess("Added to Cart! 🛒", "Item successfully added to cart!", {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      });
    },
    onError: (error: unknown) => {
      console.error("Failed to add to cart:", error);

      // Check if it's an authentication error
      const isAxiosError =
        error && typeof error === "object" && "response" in error;
      if (
        isAxiosError &&
        (error as { response: { status: number } }).response?.status === 401
      ) {
        showError("Login Required", "Please login to add items to your cart");
        // Redirect to login page after showing error
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        showError(
          "Failed to Add Item",
          "Failed to add to cart. Please try again."
        );
      }
    },
  });
};

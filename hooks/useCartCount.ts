import { useState, useEffect } from "react";
import { useCart } from "./useCart";

export function useCartCount() {
  const { cart } = useCart();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (cart?.items) {
      const totalCount = cart.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCount(totalCount);
    } else {
      setCount(0);
    }
  }, [cart]);

  return count;
}

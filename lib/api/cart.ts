import { CartResponse } from "@/types/cart";
import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXTAUTH_URL
    : "http://localhost:3001";

// Post add productid to cart product
export const addToCart = async ({
  productId,
  quantity,
}: {
  productId: number;
  quantity: number;
}) => {
  // Get Firebase auth token
  const { auth } = await import("@/lib/firebase");
  const user = auth?.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken();

  const res = await axios.post(
    `${API_BASE_URL}/api/cart`,
    {
      productId,
      quantity,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // Important: This ensures cookies are sent
    }
  );

  return res.data;
};

// Get productid to cart product by id
export const fetchCartByUser = async (): Promise<CartResponse> => {
  // Get Firebase auth token
  const { auth } = await import("@/lib/firebase");
  const user = auth?.currentUser;

  const headers: Record<string, string> = {};

  if (user) {
    const token = await user.getIdToken();
    headers["Authorization"] = `Bearer ${token}`;
  }

  const { data } = await axios.get(`${API_BASE_URL}/api/cart`, {
    headers,
    withCredentials: true, // Important: This ensures cookies are sent
  });
  return data;
};

// Update product quantity in cart
export const updateCart = async ({
  cartItemId,
  quantity,
}: {
  cartItemId: string;
  quantity: number;
}) => {
  // Get Firebase auth token
  const { auth } = await import("@/lib/firebase");
  const user = auth?.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken();

  const { data } = await axios.put(
    `${API_BASE_URL}/api/cart/${cartItemId}`,
    {
      quantity,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // Important: This ensures cookies are sent
    }
  );
  return data;
};

// Delete productid in cart
export const deleteCartById = async (
  cartItemId: string
): Promise<CartResponse> => {
  // Get Firebase auth token
  const { auth } = await import("@/lib/firebase");
  const user = auth?.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken();

  const { data } = await axios.delete(
    `${API_BASE_URL}/api/cart/${cartItemId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // Important: This ensures cookies are sent
    }
  );
  return data;
};

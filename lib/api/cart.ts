import { CartResponse } from "@/types/cart";
import axios from "axios";

// Post add productid to cart product
export const addToCart = async ({
  userId,
  productId,
  quantity,
}: {
  userId: number;
  productId: number;
  quantity: number;
}) => {
  const res = await axios.post("https://dummyjson.com/carts/add", {
    userId,
    products: [
      {
        id: productId,
        quantity,
      },
    ],
  });

  return res.data;
};

// Get productid to cart product by id
export const fetchCartByUser = async (): Promise<CartResponse> => {
  const { data } = await axios.get(`https://dummyjson.com/carts/user/6`);
  return data;
};

// Update product quantity in cart
export const updateCart = async ({
  cartId,
  productId,
  quantity,
}: {
  cartId: number;
  productId: number;
  quantity: number;
}) => {
  const { data } = await axios.put(`https://dummyjson.com/carts/${cartId}`, {
    merge: true,
    products: [{ id: productId, quantity }],
  });
  return data;
};

// Delete productid in cart
export const deleteCartById = async (cartId: number): Promise<CartResponse> => {
  const { data } = await axios.delete(`https://dummyjson.com/carts/${cartId}`);
  return data;
};

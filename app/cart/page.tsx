"use client";

import { useCartMutations, useGetCartData } from "@/hooks/useCart";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const useStr = localStorage.getItem("user");
    if (useStr) {
      const user = JSON.parse(useStr);
      if (user?.id) setUserId(user.id);
    }
  }, []);

  const { data: cartData, isLoading } = useGetCartData(6);
  const { updateMutation, deleteMutation } = useCartMutations(6);

  // ✅ Handle checkout
  const handleCheckout = (cartId: number) => {
    // Simulasi API checkout, bisa disesuaikan dengan backend kamu
    alert(`Checkout success for Cart #${cartId}`);

    // Hapus cart setelah checkout (opsional)
    deleteMutation.mutate(cartId);

    // Redirect ke halaman order success (opsional)
    router.push("/checkout-success");
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold text-center mb-10">Your Cart</h1>

      {cartData && cartData.carts.length > 0 ? (
        cartData.carts.map((cart) => (
          <div
            key={cart.id}
            className="border rounded-xl p-6 mb-10 shadow-md bg-white"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-700">
                  Cart #{cart.id}
                </h2>
                <p className="text-sm text-gray-500">User ID: {cart.userId}</p>
              </div>
              <button
                onClick={() => deleteMutation.mutate(cart.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete Cart
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cart.products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800">
                        {product.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        ${product.price} x {product.quantity}
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        Discount: {product.discountPercentage}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateMutation.mutate({
                            cartId: cart.id,
                            productId: product.id,
                            quantity: product.quantity + 1,
                          })
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        +
                      </button>
                      {product.quantity > 1 && (
                        <button
                          onClick={() =>
                            updateMutation.mutate({
                              cartId: cart.id,
                              productId: product.id,
                              quantity: product.quantity - 1,
                            })
                          }
                          className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
                        >
                          -
                        </button>
                      )}
                    </div>
                    <p className="text-right font-semibold text-gray-800">
                      Total: ${product.total}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 text-right space-y-2">
              <p className="text-lg font-semibold text-gray-700">
                Subtotal: ${cart.total}
              </p>
              <p className="text-xl font-bold text-green-600">
                Discounted Total: ${cart.discountedTotal}
              </p>
              <button
                onClick={() => handleCheckout(cart.id)}
                className="bg-green-600 text-white px-6 py-2 rounded mt-4 hover:bg-green-700 transition"
              >
                Checkout
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No cart data found for user ID {userId}.
        </p>
      )}
    </div>
  );
};

export default CartPage;

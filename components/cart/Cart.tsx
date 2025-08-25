import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { SafeImage } from "@/components/ui/SafeImage";
import DebugCart from "./DebugCart";

export default function Cart() {
  const { cart, loading, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = () => {
    console.log("Cart: Checkout button clicked, navigating to checkout");
    // Always go to checkout page - let checkout page handle auth
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-lg">Loading cart...</div>
      </div>
    );
  }

  // Debug logging
  console.log("Cart component render:", { cart, loading });
  console.log(
    "Cart items:",
    cart?.items?.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      product: item.product
        ? {
            title: item.product.title,
            image: item.product.image,
            thumbnail: item.product.thumbnail,
          }
        : null,
    }))
  );

  if (!cart || cart.items.length === 0)
    return <div className="p-8 text-center">Your cart is empty.</div>;

  const total = cart.items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Shopping Cart</h1>

      {/* Debug Component - Remove in production */}
      <DebugCart />

      <div className="flex flex-col md:flex-row gap-8">
        {/* List Cart Items */}
        <div className="flex-1">
          <ul className="divide-y">
            {cart.items.map((item, index) => (
              <li
                key={item.id || item.productId || index}
                className="flex flex-col md:flex-row items-center gap-4 py-4"
              >
                <div className="w-32 md:w-40 flex-shrink-0">
                  {item.product ? (
                    <div className="relative aspect-square">
                      {item.product.image ||
                      item.product.thumbnail ||
                      item.image ? (
                        <SafeImage
                          src={
                            item.product.image ||
                            item.product.thumbnail ||
                            item.image ||
                            ""
                          }
                          alt={item.product.title || item.name || "Product"}
                          fill
                          className="object-cover rounded"
                          sizes="(max-width: 768px) 128px, 160px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-sm">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                  ) : item.image ? (
                    <div className="relative aspect-square">
                      <SafeImage
                        src={item.image}
                        alt={item.name || "Product"}
                        fill
                        className="object-cover rounded"
                        sizes="(max-width: 768px) 128px, 160px"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-2">
                  {item.product ? (
                    <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
                      <div>
                        <div className="font-semibold line-clamp-1">
                          {item.product.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${item.product.price?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
                      <div>
                        <div className="font-semibold line-clamp-1">
                          {item.name || "Unknown Product"}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${item.price?.toFixed(2) || "0.00"}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <button
                      className="px-2 py-1 border rounded text-lg disabled:opacity-50"
                      disabled={item.quantity <= 1 || updating === item.id}
                      onClick={async () => {
                        setUpdating(item.id);
                        await decreaseQuantity(item.productId);
                        setUpdating(null);
                      }}
                    >
                      -
                    </button>
                    <span className="px-2 text-base">{item.quantity}</span>
                    <button
                      className="px-2 py-1 border rounded text-lg disabled:opacity-50"
                      disabled={updating === item.id}
                      onClick={async () => {
                        setUpdating(item.id);
                        await increaseQuantity(item.productId);
                        setUpdating(null);
                      }}
                    >
                      +
                    </button>
                  </div>
                  <span className="ml-4 text-gray-600 text-sm">
                    Subtotal: ${(item.product?.price || 0) * item.quantity}
                  </span>
                  <button
                    className="text-red-500 hover:bg-red-100 p-2 rounded-full ml-2 flex items-center justify-center"
                    onClick={() => removeFromCart(item.productId)}
                    disabled={updating === item.id}
                    title="Remove"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Cart Summary & Checkout */}
        <div className="w-full md:w-80 bg-gray-50 rounded-lg p-6 h-fit shadow">
          <h2 className="text-lg font-bold mb-4">Summary</h2>
          <ul className="mb-4 divide-y">
            {cart.items
              .filter((item) => item.product) // Filter out items without product
              .map((item, index) => (
                <li
                  key={item.id || item.productId || index}
                  className="flex justify-between items-center py-2"
                >
                  <span className="truncate flex-1">{item.product!.title}</span>
                  <span className="mx-2 text-gray-500">x{item.quantity}</span>
                  <span className="font-medium">
                    ${(item.product!.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
          </ul>
          <div className="flex justify-between mb-2 font-bold border-t pt-2">
            <span>Total</span>
            <span className="text-blue-700">${total.toFixed(2)}</span>
          </div>
          <button
            className="w-full py-2 mt-4 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useCart } from "@/hooks/useCart";

export default function DebugCart() {
  const { cart, loading, addToCart } = useCart();

  const addSampleData = () => {
    const sampleItems = [
      {
        id: "sample-1",
        productId: "1",
        quantity: 2,
        price: 29.99,
        name: "Sample Product 1",
        image:
          "https://dummyjson.com/image/400x400/008080/ffffff?text=Product+1",
        addedAt: new Date(),
        userId: "guest",
        product: {
          id: "1",
          title: "Sample Product 1",
          price: 29.99,
          image:
            "https://dummyjson.com/image/400x400/008080/ffffff?text=Product+1",
          thumbnail:
            "https://dummyjson.com/image/400x400/008080/ffffff?text=Product+1",
          images: [
            "https://dummyjson.com/image/400x400/008080/ffffff?text=Product+1",
          ],
          brand: "Sample Brand",
          category: "electronics",
          description: "Sample product for testing",
        },
      },
    ];

    localStorage.setItem("cart_items", JSON.stringify(sampleItems));
    window.location.reload();
  };

  const clearCart = () => {
    localStorage.removeItem("cart_items");
    window.location.reload();
  };

  const addTestDataToFirebase = async () => {
    try {
      const response = await fetch("/api/test-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Test data added:", result);
        alert("Test data added to Firebase!");
        window.location.reload();
      } else {
        throw new Error("Failed to add test data");
      }
    } catch (error) {
      console.error("Error adding test data:", error);
      alert("Error adding test data: " + error);
    }
  };

  const clearFirebaseData = async () => {
    try {
      const response = await fetch("/api/test-cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Firebase data cleared:", result);
        alert("Firebase data cleared!");
        window.location.reload();
      } else {
        throw new Error("Failed to clear Firebase data");
      }
    } catch (error) {
      console.error("Error clearing Firebase data:", error);
      alert("Error clearing Firebase data: " + error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded mb-4">
      <h3 className="font-bold mb-2">Debug Cart</h3>
      <p>Loading: {loading ? "Yes" : "No"}</p>
      <p>Cart Items: {cart?.items?.length || 0}</p>
      <p>Total: ${cart?.total?.toFixed(2) || "0.00"}</p>
      <div className="mt-2 space-x-2">
        <button
          onClick={addSampleData}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Add Sample Data
        </button>
        <button
          onClick={clearCart}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Clear Cart
        </button>
        <button
          onClick={() => addToCart("1", 1)}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Test Add to Cart
        </button>
        <button
          onClick={addTestDataToFirebase}
          className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
        >
          Add Firebase Test Data
        </button>
        <button
          onClick={clearFirebaseData}
          className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
        >
          Clear Firebase Data
        </button>
      </div>{" "}
      <details className="mt-2">
        <summary className="cursor-pointer text-sm text-gray-600">
          Show Cart Data
        </summary>
        <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
          {JSON.stringify(cart, null, 2)}
        </pre>
      </details>
    </div>
  );
}

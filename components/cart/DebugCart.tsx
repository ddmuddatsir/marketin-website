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
        price: 549,
        name: "iPhone 9",
        image: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
        addedAt: new Date(),
        userId: "guest",
        product: {
          id: "1",
          title: "iPhone 9",
          price: 549,
          image: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
          thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
          images: [
            "https://cdn.dummyjson.com/product-images/1/1.jpg",
            "https://cdn.dummyjson.com/product-images/1/2.jpg",
          ],
          brand: "Apple",
          category: "smartphones",
          description: "An apple mobile which is nothing like apple",
        },
      },
      {
        id: "sample-2",
        productId: "2",
        quantity: 1,
        price: 899,
        name: "iPhone X",
        image: "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg",
        addedAt: new Date(),
        userId: "guest",
        product: {
          id: "2",
          title: "iPhone X",
          price: 899,
          image: "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg",
          thumbnail: "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg",
          images: [
            "https://cdn.dummyjson.com/product-images/2/1.jpg",
            "https://cdn.dummyjson.com/product-images/2/2.jpg",
          ],
          brand: "Apple",
          category: "smartphones",
          description:
            "SIM-Free, Model A19211 6.5-inch Super Retina HD display",
        },
      },
    ];

    localStorage.setItem("cart_items", JSON.stringify(sampleItems));
    console.log("✅ Sample data added to localStorage:", sampleItems);
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

  const testDebugAPI = async () => {
    try {
      const response = await fetch("/api/debug-cart");
      const result = await response.json();
      console.log("Debug API result:", result);
      alert(`Debug API Result:\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error("Error testing debug API:", error);
      alert("Error testing debug API: " + error);
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
        <button
          onClick={testDebugAPI}
          className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
        >
          Test Debug API
        </button>
      </div>

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

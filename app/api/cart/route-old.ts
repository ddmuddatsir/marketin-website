import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyNextAuthToken } from "@/lib/verify-nextauth-token";
import { Product } from "@/types/product";
import { externalApiClient } from "@/lib/api/client";
import { FieldValue } from "firebase-admin/firestore";

interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
  addedAt: FieldValue | Date | null;
  product?: Product | null;
}

// Helper untuk fetch produk dari dummyJSON
async function fetchProductFromDummyJSON(
  productId: string | number
): Promise<Product | null> {
  try {
    const id = Number(productId);
    if (isNaN(id)) return null;

    const res = await externalApiClient.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching product from DummyJSON:", error);
    return null;
  }
}

// GET cart for current user
export async function GET(req: NextRequest) {
  try {
    console.log("🔍 GET /api/cart - Request received");

    // Check Firebase Admin availability
    if (!adminDb) {
      console.error("❌ Firebase Admin not configured");
      return NextResponse.json(
        { error: "Firebase Admin not configured" },
        { status: 503 }
      );
    }

    console.log("✅ Firebase Admin DB available");

    const userId = await verifyNextAuthToken(req);
    if (!userId) {
      console.error("❌ Unauthorized - no valid token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔍 Getting cart for user:", userId);

    // Get cart items from Firebase
    const cartRef = adminDb.collection("carts");
    const snapshot = await cartRef.where("userId", "==", userId).get();

    const items: CartItem[] = [];

    // Process each cart item
    for (const doc of snapshot.docs) {
      const data = doc.data();
      console.log("📦 Processing cart item:", doc.id, data);

      // Fetch product data from DummyJSON
      const product = await fetchProductFromDummyJSON(data.productId);

      const cartItem: CartItem = {
        id: doc.id,
        userId: data.userId,
        productId: data.productId,
        quantity: data.quantity,
        price: data.price,
        name: data.name,
        image: data.image,
        addedAt: data.addedAt?.toDate?.() || data.addedAt || new Date(),
        product: product,
      };

      items.push(cartItem);
    }

    console.log("✅ Cart loaded successfully:", items.length, "items");

    const response = {
      items,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(req: NextRequest) {
  try {
    console.log("➕ POST /api/cart - Request received");

    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured" },
        { status: 503 }
      );
    }

    const userId = await verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, quantity = 1, price, name, image } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    console.log("➕ Adding to cart:", { userId, productId, quantity });

    // Check if item already exists in cart
    const cartRef = adminDb.collection("carts");
    const existingSnapshot = await cartRef
      .where("userId", "==", userId)
      .where("productId", "==", productId.toString())
      .get();

    if (!existingSnapshot.empty) {
      // Update existing item
      const existingDoc = existingSnapshot.docs[0];
      const existingData = existingDoc.data();

      await existingDoc.ref.update({
        quantity: existingData.quantity + quantity,
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log("✅ Updated existing cart item");
    } else {
      // Add new item
      await cartRef.add({
        userId,
        productId: productId.toString(),
        quantity,
        price: price || 0,
        name: name || "Unknown Product",
        image: image || null,
        addedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log("✅ Added new cart item");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

// DELETE - Clear entire cart
export async function DELETE(req: NextRequest) {
  try {
    console.log("🗑️ DELETE /api/cart - Request received");

    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured" },
        { status: 503 }
      );
    }

    const userId = await verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all cart items for user
    const cartRef = adminDb.collection("carts");
    const snapshot = await cartRef.where("userId", "==", userId).get();

    const batch = adminDb.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    console.log("✅ Cart cleared successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}

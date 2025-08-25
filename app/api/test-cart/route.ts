import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    console.log("🧪 Adding test cart data to Firebase");

    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured" },
        { status: 503 }
      );
    }

    // Sample cart data
    const testCartItems = [
      {
        userId: "test-user-123",
        productId: "1",
        quantity: 2,
        price: 29.99,
        name: "iPhone 9",
        image:
          "https://dummyjson.com/image/400x400/008080/ffffff?text=iPhone+9",
        addedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      {
        userId: "test-user-123",
        productId: "2",
        quantity: 1,
        price: 599,
        name: "iPhone X",
        image:
          "https://dummyjson.com/image/400x400/008080/ffffff?text=iPhone+X",
        addedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
    ];

    // Add to Firebase
    const cartRef = adminDb.collection("carts");

    for (const item of testCartItems) {
      await cartRef.add(item);
      console.log("✅ Added test cart item:", item.name);
    }

    return NextResponse.json({
      success: true,
      message: `Added ${testCartItems.length} test cart items to Firebase`,
      items: testCartItems,
    });
  } catch (error) {
    console.error("❌ Error adding test cart data:", error);
    return NextResponse.json(
      { error: "Failed to add test cart data" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    console.log("🧹 Clearing all test cart data from Firebase");

    if (!adminDb) {
      return NextResponse.json(
        { error: "Firebase Admin not configured" },
        { status: 503 }
      );
    }

    // Clear all cart data
    const cartRef = adminDb.collection("carts");
    const snapshot = await cartRef.get();

    const batch = adminDb.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: `Cleared ${snapshot.docs.length} cart items from Firebase`,
    });
  } catch (error) {
    console.error("❌ Error clearing test cart data:", error);
    return NextResponse.json(
      { error: "Failed to clear test cart data" },
      { status: 500 }
    );
  }
}

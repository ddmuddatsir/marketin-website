import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// POST - Add sample wishlist data for testing
export async function POST() {
  try {
    console.log("➕ Adding sample wishlist data...");

    // Check Firebase availability
    if (!db) {
      console.error("❌ Firebase not configured");
      return NextResponse.json(
        { error: "Firebase not configured" },
        { status: 503 }
      );
    }

    // Add sample data directly
    const wishlistRef = collection(db, "wishlists");

    const sampleItems = [
      {
        userId: "test-user-id",
        productId: "1",
        addedAt: serverTimestamp(),
      },
      {
        userId: "test-user-id",
        productId: "2",
        addedAt: serverTimestamp(),
      },
      {
        userId: "test-user-id",
        productId: "3",
        addedAt: serverTimestamp(),
      },
    ];

    const results = [];
    for (const item of sampleItems) {
      try {
        const docRef = await addDoc(wishlistRef, item);
        results.push({ id: docRef.id, ...item });
        console.log("✅ Added sample item:", docRef.id);
      } catch (error) {
        console.error("❌ Error adding item:", error);
        results.push({ error: String(error), item });
      }
    }

    return NextResponse.json({
      message: "Sample data added",
      items: results,
    });
  } catch (error) {
    console.error("❌ Error adding sample data:", error);
    return NextResponse.json(
      {
        error: "Failed to add sample data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

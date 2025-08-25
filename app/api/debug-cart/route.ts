import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  try {
    console.log("🔍 Debug API called");

    // Check Firebase Admin
    if (!adminDb) {
      return NextResponse.json({
        status: "error",
        message: "Firebase Admin not configured",
        adminDb: false,
      });
    }

    console.log("✅ Firebase Admin available");

    // Try to query carts collection
    const cartRef = adminDb.collection("carts");
    const snapshot = await cartRef.limit(10).get();

    console.log("📊 Cart collection query result:", snapshot.size);

    const allCarts = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));

    return NextResponse.json({
      status: "success",
      adminDb: true,
      cartCollectionSize: snapshot.size,
      allCarts: allCarts,
      firebaseConfig: {
        projectId: process.env.FIREBASE_PROJECT_ID || "missing",
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      },
    });
  } catch (error) {
    console.error("❌ Debug API error:", error);
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      adminDb: !!adminDb,
    });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyNextAuthToken } from "@/lib/verify-nextauth-token";

// DELETE - Remove specific item from cart
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🗑️ DELETE /api/cart/[id] - Request received");

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

    const { id } = params;

    // Find and delete the cart item
    const cartRef = adminDb.collection("carts");
    const doc = await cartRef.doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    const data = doc.data();
    if (data?.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to cart item" },
        { status: 403 }
      );
    }

    await doc.ref.delete();

    console.log("✅ Cart item deleted successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting cart item:", error);
    return NextResponse.json(
      { error: "Failed to delete cart item" },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("📝 PUT /api/cart/[id] - Request received");

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

    const { id } = params;
    const body = await req.json();
    const { quantity } = body;

    if (typeof quantity !== "number" || quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    // Find and update the cart item
    const cartRef = adminDb.collection("carts");
    const doc = await cartRef.doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    const data = doc.data();
    if (data?.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to cart item" },
        { status: 403 }
      );
    }

    await doc.ref.update({
      quantity,
      updatedAt: new Date(),
    });

    console.log("✅ Cart item updated successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error updating cart item:", error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

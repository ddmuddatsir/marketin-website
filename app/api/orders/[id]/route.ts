import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyToken } from "@/lib/verify-token";

// GET specific order by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🔍 GET /api/orders/[id] - Request received");

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
    console.log("🔍 Getting order:", id, "for user:", userId);

    // Get order from Firebase
    const orderDoc = await adminDb.collection("orders").doc(id).get();

    if (!orderDoc.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = orderDoc.data();

    // Verify order belongs to user
    if (orderData?.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to order" },
        { status: 403 }
      );
    }

    const order = {
      id: orderDoc.id,
      ...orderData,
      createdAt: orderData.createdAt?.toDate?.() || orderData.createdAt,
      updatedAt: orderData.updatedAt?.toDate?.() || orderData.updatedAt,
    };

    console.log("✅ Order retrieved successfully");
    return NextResponse.json(order);
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PUT - Update order status
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("📝 PUT /api/orders/[id] - Request received");

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
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Get order and verify ownership
    const orderDoc = await adminDb.collection("orders").doc(id).get();

    if (!orderDoc.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = orderDoc.data();
    if (orderData?.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to order" },
        { status: 403 }
      );
    }

    // Update order status
    await orderDoc.ref.update({
      status,
      updatedAt: new Date(),
    });

    console.log("✅ Order status updated successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

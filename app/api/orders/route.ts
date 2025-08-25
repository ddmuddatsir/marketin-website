import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyToken } from "@/lib/verify-token";
import { FieldValue } from "firebase-admin/firestore";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

interface ShippingAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  [key: string]: string | undefined;
}

interface OrderData {
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod?: string;
  shippingAddress?: ShippingAddress | null;
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date;
}

// GET orders for current user
export async function GET(req: NextRequest) {
  try {
    console.log("🔍 GET /api/orders - Request received");

    if (!adminDb) {
      console.error("❌ Firebase Admin not configured");
      return NextResponse.json(
        { error: "Firebase Admin not configured" },
        { status: 503 }
      );
    }

    const userId = await verifyToken(req);
    if (!userId) {
      console.error("❌ Unauthorized - no valid token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔍 Getting orders for user:", userId);

    // Get orders from Firebase
    const ordersRef = adminDb.collection("orders");

    try {
      // Try to use the optimized query with ordering
      const snapshot = await ordersRef
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      }));

      console.log("✅ Orders loaded successfully:", orders.length, "orders");
      return NextResponse.json(orders);
    } catch (error: unknown) {
      // If index is missing, fall back to simple query and sort client-side
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error.code === 9 ||
          ("message" in error &&
            typeof error.message === "string" &&
            error.message.includes("requires an index")))
      ) {
        console.log("⚠️ Index missing, falling back to simple query...");

        const fallbackSnapshot = await ordersRef
          .where("userId", "==", userId)
          .get();

        const orders = fallbackSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
        }));

        // Sort client-side by createdAt descending
        orders.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        console.log("✅ Orders loaded with fallback:", orders.length, "orders");
        console.log(
          "💡 Please create the Firestore index for better performance:"
        );
        console.log(
          "   https://console.firebase.google.com/v1/r/project/marketin-462707/firestore/indexes"
        );

        return NextResponse.json(orders);
      }

      // Re-throw other errors
      throw error;
    }
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(req: NextRequest) {
  try {
    console.log("➕ POST /api/orders - Request received");

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
    const { items, total, paymentMethod, shippingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    console.log("➕ Creating order:", {
      userId,
      itemsCount: items.length,
      total,
    });

    // Create order document
    const orderData: OrderData = {
      userId,
      items,
      total: total || 0,
      status: "pending",
      paymentMethod: paymentMethod || "cash_on_delivery",
      shippingAddress: shippingAddress || null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const orderRef = await adminDb.collection("orders").add(orderData);

    // Clear user's cart after successful order
    const cartRef = adminDb.collection("carts");
    const cartSnapshot = await cartRef.where("userId", "==", userId).get();

    const batch = adminDb.batch();
    cartSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    console.log("✅ Order created successfully:", orderRef.id);
    return NextResponse.json({
      success: true,
      orderId: orderRef.id,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

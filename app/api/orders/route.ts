import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/lib/verify-token";
import { getUserOrders, createOrder, getAddressById } from "@/lib/firestore";
import { z } from "zod";

const orderSchema = z.object({
  addressId: z.string(),
  paymentMethod: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      price: z.number().positive(),
      name: z.string(),
    })
  ),
  total: z.number().positive(),
});

export async function GET(req: NextRequest) {
  try {
    const userId = await verifyToken(req);
    console.log("GET /api/orders - User ID:", userId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orders = await getUserOrders(userId);
    console.log("GET /api/orders - Found orders count:", orders.length);
    console.log("GET /api/orders - Orders:", JSON.stringify(orders, null, 2));

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyToken(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log("Order request body:", JSON.stringify(body, null, 2));
    console.log("User ID:", userId);

    const validatedData = orderSchema.parse(body);
    console.log("Validated data:", JSON.stringify(validatedData, null, 2));

    // Verify address exists and belongs to user
    console.log("Looking for address ID:", validatedData.addressId);
    const address = await getAddressById(validatedData.addressId);
    console.log(
      "Found address:",
      address ? { id: address.id, userId: address.userId } : null
    );

    if (!address) {
      console.error("Address not found for ID:", validatedData.addressId);
      return new NextResponse("Address not found", { status: 400 });
    }

    if (address.userId !== userId) {
      console.error(
        "Address belongs to different user. Address userId:",
        address.userId,
        "Request userId:",
        userId
      );
      return new NextResponse("Address does not belong to user", {
        status: 400,
      });
    }

    // Create order with validated data
    const order = await createOrder(userId, {
      items: validatedData.items,
      shippingAddressId: validatedData.addressId,
      paymentMethod: validatedData.paymentMethod,
      total: validatedData.total,
    });

    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return new NextResponse("Invalid order data", { status: 400 });
    }
    console.error("Error creating order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/verify-token";
import { externalApiClient } from "@/lib/api/client";

// GET: List all orders for current user
export async function GET(req: NextRequest) {
  try {
    const userId = await verifyToken(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        shippingAddress: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("Raw orders from database:", orders.length);

    // Enrich orders with product data
    const ordersWithProductData = await Promise.all(
      orders.map(async (order) => {
        console.log(
          `Processing order ${order.id} with ${order.items.length} items`
        );

        const itemsWithProductData = await Promise.all(
          order.items.map(async (item) => {
            let productData = null;

            // First try to get from stored productData
            if (item.productData) {
              try {
                productData =
                  typeof item.productData === "string"
                    ? JSON.parse(item.productData)
                    : item.productData;
                console.log(
                  `Found stored product data for item ${item.id}:`,
                  productData.title
                );
              } catch (e) {
                console.log("Error parsing stored productData:", e);
              }
            }

            // If no stored data, fetch from DummyJSON API
            if (!productData && item.productId) {
              try {
                console.log(
                  `Fetching product data for productId: ${item.productId}`
                );
                const response = await externalApiClient.get(
                  `/products/${item.productId}`
                );
                const product = response.data;
                productData = {
                  title: product.title,
                  image: product.thumbnail || product.images?.[0],
                  brand: product.brand,
                  category: product.category,
                };
                console.log(
                  `Fetched product data from API:`,
                  productData.title
                );
              } catch (error) {
                console.log("Error fetching product from API:", error);
              }
            }

            return {
              ...item,
              productData,
            };
          })
        );

        return {
          ...order,
          items: itemsWithProductData,
          total: order.total || 0,
        };
      })
    );

    console.log("Returning enriched orders:", ordersWithProductData.length);
    return NextResponse.json(ordersWithProductData);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST: Create new order
export async function POST(req: NextRequest) {
  try {
    console.log("=== ORDER API START ===");
    console.log(
      "Headers:",
      req.headers.get("authorization")
        ? "Auth header present"
        : "No auth header"
    );

    const userId = await verifyToken(req);
    console.log("Verified userId:", userId);

    if (!userId) {
      console.log("Authorization failed - no userId returned");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    interface OrderItemInput {
      productId?: string;
      quantity: number;
      price?: number;
      product?: {
        id?: string;
        title?: string;
        price?: number;
        thumbnail?: string;
        image?: string;
        brand?: string;
        category?: string;
        description?: string;
      };
    }

    const { items, addressId, total, paymentMethod = "COD" } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new NextResponse("No items to order", { status: 400 });
    }

    if (!addressId) {
      return new NextResponse("Address is required", { status: 400 });
    }

    // Verify the address belongs to the user
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: userId,
      },
    });

    if (!address) {
      return new NextResponse("Address not found", { status: 404 });
    }

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: "PENDING",
          total: total,
          paymentMethod,
          shippingAddressId: addressId,
          items: {
            create: items.map((item: OrderItemInput) => ({
              productId:
                item.productId?.toString() ||
                item.product?.id?.toString() ||
                "",
              quantity: item.quantity,
              price: item.product?.price || item.price || 0,
              productData: JSON.stringify({
                title: item.product?.title || "Product",
                image: item.product?.thumbnail || item.product?.image,
                brand: item.product?.brand,
                category: item.product?.category,
                description: item.product?.description,
              }),
            })),
          },
        },
        include: {
          items: true,
          shippingAddress: true,
        },
      });

      return newOrder;
    });

    // Clear the cart after successful order (only if not direct order)
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("[ORDER_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

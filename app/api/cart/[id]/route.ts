import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/lib/verify-token";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifyToken(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { quantity } = body;

    if (!quantity) {
      return new NextResponse("Missing quantity", { status: 400 });
    }

    const cart = await prisma.cart.findFirst({
      where: {
        userId,
      },
    });

    if (!cart) {
      return new NextResponse("Cart not found", { status: 404 });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: id, // productId is string in schema
      },
    });

    if (!cartItem) {
      return new NextResponse("Cart item not found", { status: 404 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: {
          id: cartItem.id,
        },
      });
      return new NextResponse("Item removed from cart", { status: 200 });
    }

    await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity,
      },
    });

    return new NextResponse("Cart item updated", { status: 200 });
  } catch (error) {
    console.error("[CART_ITEM_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifyToken(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const cart = await prisma.cart.findFirst({
      where: {
        userId,
      },
    });

    if (!cart) {
      return new NextResponse("Cart not found", { status: 404 });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: id, // productId is string in schema
      },
    });

    if (!cartItem) {
      return new NextResponse("Cart item not found", { status: 404 });
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    return new NextResponse("Item removed from cart", { status: 200 });
  } catch (error) {
    console.error("[CART_ITEM_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

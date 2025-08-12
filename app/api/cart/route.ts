import { NextResponse, NextRequest } from "next/server";
import { getUserCart, addToCart, clearUserCart } from "@/lib/firestore";
import { verifyToken } from "@/lib/verify-token";
import { CartItemEntity, RawCartItemEntity } from "@/types/cart";
import { externalApiClient } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const userId = await verifyToken(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the user's cart items from the database
    const rawCartItems = await getUserCart(userId);

    const cartItems: CartItemEntity[] = rawCartItems.map(
      (item: RawCartItemEntity) => ({
        id: item.id || item.productId || "",
        productId: item.productId || item.id || "",
        quantity: item.quantity ?? 1,
        price: item.price ?? 0,
        name: item.name ?? "",
        image: item.image,
      })
    );

    // Fetch product details for each cart item
    const cartItemsWithProducts = await Promise.all(
      cartItems.map(async (item: CartItemEntity) => {
        try {
          const productResponse = await externalApiClient.get(
            `/products/${item.productId}`
          );
          const product = productResponse.data;
          return {
            ...item,
            product: {
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.thumbnail || product.images?.[0],
              thumbnail: product.thumbnail,
              images: product.images,
              description: product.description,
              brand: product.brand,
              category: product.category,
            },
          };
        } catch (error) {
          console.error(`Failed to fetch product ${item.productId}:`, error);
          return item;
        }
      })
    );

    return NextResponse.json({
      items: cartItemsWithProducts,
    });
  } catch (error) {
    console.error("[CART_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyToken(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { productId, quantity = 1, price, name, image } = body;

    if (!productId || !price || !name) {
      return new NextResponse(
        "Missing required fields: productId, price, name",
        { status: 400 }
      );
    }

    // Add item to cart
    const cartItem = await addToCart(userId, {
      productId: productId.toString(),
      quantity,
      price,
      name,
      image,
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("[CART_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await verifyToken(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Clear all cart items for the user
    await clearUserCart(userId);

    return new NextResponse("Cart cleared", { status: 200 });
  } catch (error) {
    console.error("[CART_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

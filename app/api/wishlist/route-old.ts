import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyToken } from "@/lib/verify-token";
import { Product } from "@/types/product";
import { externalApiClient } from "@/lib/api/client";

interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: Timestamp | null;
  product?: Product | null;
}

// Helper untuk fetch produk dari dummyJSON
async function fetchProductFromDummyJSON(
  productId: string | number
): Promise<Product | null> {
  try {
    const id = Number(productId);
    if (isNaN(id)) return null;

    const res = await externalApiClient.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching product from DummyJSON:", error);
    return null;
  }
}

// GET wishlist for current user
export async function GET(req: NextRequest) {
  try {
    console.log("🔍 GET /api/wishlist - Request received");

    // Check Firebase availability
    if (!db) {
      console.error("❌ Firebase not configured");
      return NextResponse.json(
        { error: "Firebase not configured" },
        { status: 503 }
      );
    }

    console.log("✅ Firebase DB available");

    const userId = await verifyToken(req);
    if (!userId) {
      console.error("❌ Unauthorized - no valid token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ Authenticated user:", userId);

    // Query Firestore untuk wishlist items
    try {
      const wishlistRef = collection(db, "wishlists");
      const q = query(wishlistRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      console.log("📊 Found wishlist documents:", querySnapshot.size);

      const wishlistItems: WishlistItem[] = [];

      // Collect all wishlist items
      querySnapshot.forEach((docSnapshot) => {
        const wishlistData = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        } as WishlistItem;
        console.log("📝 Wishlist item:", wishlistData);
        wishlistItems.push(wishlistData);
      });

      // Fetch product data for each item
      console.log("🛍️ Fetching products for", wishlistItems.length, "items");

      const enrichedWishlistItems = await Promise.all(
        wishlistItems.map(async (item) => {
          try {
            const product = await fetchProductFromDummyJSON(item.productId);
            console.log(
              "� Fetched product for",
              item.productId,
              ":",
              product?.title
            );
            return {
              ...item,
              product: product,
            };
          } catch (error) {
            console.error(
              "❌ Error fetching product",
              item.productId,
              ":",
              error
            );
            return {
              ...item,
              product: null,
            };
          }
        })
      );

      console.log(
        "📤 Returning wishlist:",
        enrichedWishlistItems.length,
        "items"
      );

      return NextResponse.json({
        items: enrichedWishlistItems,
        total: enrichedWishlistItems.length,
      });
    } catch (firestoreError) {
      console.error("❌ Firestore error:", firestoreError);
      return NextResponse.json(
        { error: "Database error", details: String(firestoreError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Error fetching wishlist:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch wishlist",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
export async function POST(req: NextRequest) {
  try {
    console.log("➕ POST /api/wishlist - Request received");

    // Check Firebase availability
    if (!db) {
      console.error("❌ Firebase not configured");
      return NextResponse.json(
        { error: "Firebase not configured" },
        { status: 503 }
      );
    }

    const userId = await verifyToken(req);
    if (!userId) {
      console.error("❌ Unauthorized - no valid token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ Authenticated user:", userId);

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if item already exists in wishlist
    const wishlistRef = collection(db, "wishlists");
    const q = query(
      wishlistRef,
      where("userId", "==", userId),
      where("productId", "==", productId.toString())
    );
    const existingSnapshot = await getDocs(q);

    if (!existingSnapshot.empty) {
      return NextResponse.json(
        { error: "Item already in wishlist" },
        { status: 409 }
      );
    }

    // Add to Firebase Firestore
    const newWishlistItem = {
      userId,
      productId: productId.toString(),
      addedAt: serverTimestamp(),
    };

    const docRef = await addDoc(wishlistRef, newWishlistItem);

    // Fetch product details untuk response
    const product = await fetchProductFromDummyJSON(productId);

    return NextResponse.json({
      id: docRef.id,
      ...newWishlistItem,
      product,
      message: "Item added to wishlist successfully",
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add item to wishlist" },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(req: NextRequest) {
  try {
    // Check Firebase availability
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not configured" },
        { status: 503 }
      );
    }

    const userId = await verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Find and delete the wishlist item
    const wishlistRef = collection(db, "wishlists");
    const q = query(
      wishlistRef,
      where("userId", "==", userId),
      where("productId", "==", productId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "Item not found in wishlist" },
        { status: 404 }
      );
    }

    // Delete all matching documents (should be only one)
    const deletePromises = querySnapshot.docs.map((docSnapshot) =>
      deleteDoc(doc(db!, "wishlists", docSnapshot.id))
    );
    await Promise.all(deletePromises);

    return NextResponse.json({
      message: "Item removed from wishlist successfully",
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to remove item from wishlist" },
      { status: 500 }
    );
  }
}

// PUT - Sync entire wishlist (for offline sync)
export async function PUT(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not configured" },
        { status: 503 }
      );
    }

    const userId = await verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items must be an array" },
        { status: 400 }
      );
    }

    // Clear existing wishlist items for this user
    const wishlistRef = collection(db, "wishlists");
    const q = query(wishlistRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    // Delete existing items
    const deletePromises = querySnapshot.docs.map((docSnapshot) =>
      deleteDoc(doc(db!, "wishlists", docSnapshot.id))
    );
    await Promise.all(deletePromises);

    // Add new items
    const addPromises = items.map((item: WishlistItem) =>
      addDoc(collection(db!, "wishlists"), {
        userId,
        productId: item.productId,
        addedAt: serverTimestamp(),
      })
    );
    await Promise.all(addPromises);

    return NextResponse.json({
      message: "Wishlist synced successfully",
      count: items.length,
    });
  } catch (error) {
    console.error("Error syncing wishlist:", error);
    return NextResponse.json(
      { error: "Failed to sync wishlist" },
      { status: 500 }
    );
  }
}

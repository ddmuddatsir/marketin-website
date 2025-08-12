import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
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

    // Query Firestore untuk wishlist items
    const wishlistRef = collection(db, "wishlists");
    const q = query(wishlistRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const wishlistItems: WishlistItem[] = [];
    const productPromises: Promise<{
      wishlistItemId: string;
      product: Product | null;
    }>[] = [];

    // Collect all wishlist items dan prepare product fetch promises
    querySnapshot.forEach((docSnapshot) => {
      const wishlistData = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      } as WishlistItem;
      wishlistItems.push(wishlistData);

      // Fetch product data dari DummyJSON
      if (wishlistData.productId) {
        productPromises.push(
          fetchProductFromDummyJSON(wishlistData.productId).then((product) => ({
            wishlistItemId: docSnapshot.id,
            product: product,
          }))
        );
      }
    });

    // Wait for all product data
    const productResults = await Promise.all(productPromises);

    // Combine wishlist items dengan product data
    const enrichedWishlistItems = wishlistItems.map((item) => {
      const productResult = productResults.find(
        (p) => p.wishlistItemId === item.id
      );
      return {
        ...item,
        product: productResult?.product || null,
      };
    });

    return NextResponse.json({
      items: enrichedWishlistItems,
      total: enrichedWishlistItems.length,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
export async function POST(req: NextRequest) {
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

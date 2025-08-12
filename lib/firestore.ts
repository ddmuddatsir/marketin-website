import { adminDb } from "@/lib/firebase-admin";
// User operations
export async function getUserById(userId: string): Promise<{
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
} | null> {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const userDocRef = adminDb.collection("users").doc(userId);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    return null;
  }

  const userData = userDoc.data();
  return {
    id: userDoc.id,
    email: userData?.email,
    name: userData?.name,
    image: userData?.image,
    createdAt: userData?.createdAt,
    updatedAt: userData?.updatedAt,
  };
}

export async function updateUser(
  userId: string,
  updateData: Partial<{
    name: string;
    email: string;
    image: string;
  }>
) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const userDocRef = adminDb.collection("users").doc(userId);
  await userDocRef.update({
    ...updateData,
    updatedAt: new Date(),
  });

  return getUserById(userId);
}

// Check if email is already taken by another user
export async function isEmailTaken(
  email: string,
  excludeUserId?: string
): Promise<boolean> {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const usersQuery = adminDb.collection("users").where("email", "==", email);
  const usersSnapshot = await usersQuery.get();

  if (usersSnapshot.empty) {
    return false;
  }

  // If we're excluding a user ID (for updates), check if any other user has this email
  if (excludeUserId) {
    return usersSnapshot.docs.some((doc) => doc.id !== excludeUserId);
  }

  return true;
}

// Create user function for registration
export async function createUser(
  userId: string,
  userData: {
    email: string;
    name?: string;
    image?: string;
  }
) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const userDocRef = adminDb.collection("users").doc(userId);
  await userDocRef.set({
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { id: userId, ...userData };
}

// Address operations
export async function createAddress(
  userId: string,
  addressData: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  }
) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const addressRef = await adminDb.collection("addresses").add({
    ...addressData,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { id: addressRef.id, ...addressData, userId };
}

export async function getUserAddresses(userId: string) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const addressesQuery = adminDb
    .collection("addresses")
    .where("userId", "==", userId);
  // Removed orderBy to avoid index requirement in development

  const addressesSnapshot = await addressesQuery.get();
  return addressesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function updateAddress(
  addressId: string,
  updateData: Partial<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>
) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const addressRef = adminDb.collection("addresses").doc(addressId);
  await addressRef.update({
    ...updateData,
    updatedAt: new Date(),
  });

  const addressDoc = await addressRef.get();
  return { id: addressDoc.id, ...addressDoc.data() };
}

export async function deleteAddress(addressId: string) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const addressRef = adminDb.collection("addresses").doc(addressId);
  await addressRef.delete();
}

export async function getAddressById(addressId: string): Promise<{
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} | null> {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const addressRef = adminDb.collection("addresses").doc(addressId);
  const addressDoc = await addressRef.get();

  if (!addressDoc.exists) {
    return null;
  }

  const addressData = addressDoc.data();
  return {
    id: addressDoc.id,
    userId: addressData?.userId,
    street: addressData?.street,
    city: addressData?.city,
    state: addressData?.state,
    postalCode: addressData?.postalCode,
    country: addressData?.country,
    isDefault: addressData?.isDefault,
    createdAt: addressData?.createdAt,
    updatedAt: addressData?.updatedAt,
  };
}

// Order operations
export async function createOrder(
  userId: string,
  orderData: {
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      name: string;
    }>;
    shippingAddressId: string;
    paymentMethod: string;
    total: number;
  }
) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  console.log("Creating order for user:", userId);
  console.log("Order data:", JSON.stringify(orderData, null, 2));

  const orderRef = await adminDb.collection("orders").add({
    ...orderData,
    userId,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("Order created with ID:", orderRef.id);

  return { id: orderRef.id, ...orderData, userId, status: "pending" };
}

export async function getUserOrders(userId: string) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const ordersQuery = adminDb
    .collection("orders")
    .where("userId", "==", userId);
  // Removed orderBy to avoid index requirement in development

  const ordersSnapshot = await ordersQuery.get();
  const orders = [];

  type OrderData = {
    id: string;
    userId: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      name: string;
    }>;
    shippingAddressId: string;
    paymentMethod: string;
    total: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    shippingAddress?: {
      id: string;
      userId: string;
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      isDefault?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
    }; // Typed shipping address
  };

  for (const orderDoc of ordersSnapshot.docs) {
    const orderDocData = orderDoc.data();
    const orderData = { id: orderDoc.id, ...orderDocData } as OrderData;

    // Get shipping address if provided
    if (orderDocData.shippingAddressId) {
      const addressRef = adminDb
        .collection("addresses")
        .doc(orderDocData.shippingAddressId);
      const addressDoc = await addressRef.get();
      if (addressDoc.exists) {
        orderData.shippingAddress = {
          id: addressDoc.id,
          ...(addressDoc.data() as {
            userId: string;
            street: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            isDefault?: boolean;
            createdAt?: Date;
            updatedAt?: Date;
          }),
        };
      }
    }

    orders.push(orderData);
  }

  return orders;
}

export async function getOrderById(orderId: string) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  type OrderData = {
    id: string;
    userId: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      name: string;
    }>;
    shippingAddressId: string;
    paymentMethod: string;
    total: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    shippingAddress?: {
      id: string;
      userId: string;
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      isDefault?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
    };
  };

  const orderRef = adminDb.collection("orders").doc(orderId);
  const orderDoc = await orderRef.get();

  if (!orderDoc.exists) {
    return null;
  }

  const orderDocData = orderDoc.data();
  const orderData = { id: orderDoc.id, ...orderDocData } as OrderData;

  // Get shipping address if provided
  if (orderDocData?.shippingAddressId) {
    const addressRef = adminDb
      .collection("addresses")
      .doc(orderDocData.shippingAddressId);
    const addressDoc = await addressRef.get();
    if (addressDoc.exists) {
      orderData.shippingAddress = {
        id: addressDoc.id,
        ...(addressDoc.data() as {
          userId: string;
          street: string;
          city: string;
          state: string;
          postalCode: string;
          country: string;
          isDefault?: boolean;
          createdAt?: Date;
          updatedAt?: Date;
        }),
      };
    }
  }

  return orderData;
}

// Cart operations
export async function getUserCart(userId: string) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const cartQuery = adminDb.collection("cart").where("userId", "==", userId);
  const cartSnapshot = await cartQuery.get();
  return cartSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addToCart(
  userId: string,
  cartItem: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
    image?: string;
  }
) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  // Check if item already exists in cart
  const existingCartQuery = adminDb
    .collection("cart")
    .where("userId", "==", userId)
    .where("productId", "==", cartItem.productId);

  const existingCartSnapshot = await existingCartQuery.get();

  if (!existingCartSnapshot.empty) {
    // Update existing item
    const existingDoc = existingCartSnapshot.docs[0];
    const currentQuantity = existingDoc.data().quantity || 0;
    await existingDoc.ref.update({
      quantity: currentQuantity + cartItem.quantity,
      updatedAt: new Date(),
    });
    return {
      id: existingDoc.id,
      ...existingDoc.data(),
      quantity: currentQuantity + cartItem.quantity,
    };
  } else {
    // Add new item
    const cartRef = await adminDb.collection("cart").add({
      ...cartItem,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: cartRef.id, ...cartItem, userId };
  }
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const cartRef = adminDb.collection("cart").doc(cartItemId);

  if (quantity <= 0) {
    await cartRef.delete();
    return null;
  }

  await cartRef.update({
    quantity,
    updatedAt: new Date(),
  });

  const cartDoc = await cartRef.get();
  return { id: cartDoc.id, ...cartDoc.data() };
}

export async function removeFromCart(cartItemId: string) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const cartRef = adminDb.collection("cart").doc(cartItemId);
  await cartRef.delete();
}

export async function clearUserCart(userId: string) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const cartQuery = adminDb.collection("cart").where("userId", "==", userId);
  const cartSnapshot = await cartQuery.get();

  const deletePromises = cartSnapshot.docs.map((doc) => doc.ref.delete());
  await Promise.all(deletePromises);
}

// Wishlist operations
export async function getUserWishlist(userId: string) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const wishlistQuery = adminDb
    .collection("wishlist")
    .where("userId", "==", userId);
  // Removed orderBy to avoid index requirement in development

  const wishlistSnapshot = await wishlistQuery.get();
  return wishlistSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addToWishlist(userId: string, productId: string) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  // Check if already in wishlist
  const existingWishlistQuery = adminDb
    .collection("wishlist")
    .where("userId", "==", userId)
    .where("productId", "==", productId);

  const existingWishlistSnapshot = await existingWishlistQuery.get();

  if (!existingWishlistSnapshot.empty) {
    return {
      id: existingWishlistSnapshot.docs[0].id,
      ...existingWishlistSnapshot.docs[0].data(),
    };
  }

  const wishlistRef = await adminDb.collection("wishlist").add({
    userId,
    productId,
    createdAt: new Date(),
  });

  return { id: wishlistRef.id, userId, productId };
}

export async function removeFromWishlist(userId: string, productId: string) {
  if (!adminDb) {
    throw new Error("Firestore not initialized");
  }

  const wishlistQuery = adminDb
    .collection("wishlist")
    .where("userId", "==", userId)
    .where("productId", "==", productId);

  const wishlistSnapshot = await wishlistQuery.get();
  const deletePromises = wishlistSnapshot.docs.map((doc) => doc.ref.delete());
  await Promise.all(deletePromises);
}

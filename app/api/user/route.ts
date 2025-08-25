import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { verifyToken } from "@/lib/verify-token";

// GET user profile
export async function GET(req: NextRequest) {
  try {
    console.log("🔍 GET /api/user - Request received");

    if (!adminDb || !adminAuth) {
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

    console.log("🔍 Getting user profile for:", userId);

    // Get user from Firebase Auth
    const userRecord = await adminAuth.getUser(userId);

    // Get additional user data from Firestore if exists
    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    const profile = {
      id: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || userData?.name || "",
      photoURL: userRecord.photoURL || userData?.photoURL || "",
      emailVerified: userRecord.emailVerified,
      createdAt: userRecord.metadata.creationTime,
      lastSignIn: userRecord.metadata.lastSignInTime,
      ...userData,
    };

    console.log("✅ User profile retrieved successfully");
    return NextResponse.json(profile);
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

// PUT update user profile
export async function PUT(req: NextRequest) {
  try {
    console.log("📝 PUT /api/user - Request received");

    if (!adminDb || !adminAuth) {
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
    const { name, email, currentPassword, newPassword } = body;

    console.log("📝 Updating user profile:", { userId, name, email });

    // Update Firebase Auth user
    const updateData: Record<string, string> = {};
    if (name) updateData.displayName = name;
    if (email) updateData.email = email;

    if (Object.keys(updateData).length > 0) {
      await adminAuth.updateUser(userId, updateData);
    }

    // Update password if provided
    if (newPassword && currentPassword) {
      try {
        // For password update, we need to verify current password first
        // This would typically be done on client-side with Firebase Auth
        await adminAuth.updateUser(userId, {
          password: newPassword,
        });
      } catch (error) {
        console.error("❌ Error updating password:", error);
        return NextResponse.json(
          { error: "Failed to update password" },
          { status: 400 }
        );
      }
    }

    // Update additional data in Firestore
    const firestoreData = {
      name: name || "",
      email: email || "",
      updatedAt: new Date(),
    };

    await adminDb
      .collection("users")
      .doc(userId)
      .set(firestoreData, { merge: true });

    console.log("✅ User profile updated successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}

import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function verifyToken(req: NextRequest): Promise<string | null> {
  try {
    console.log("adminAuth status:", !!adminAuth);

    const authHeader = req.headers.get("authorization");
    console.log("Auth header:", authHeader ? "Present" : "Missing");

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("Invalid auth header format");
      return null;
    }

    const token = authHeader.split("Bearer ")[1];
    console.log("Token length:", token?.length || 0);

    if (!token) {
      console.log("Token missing");
      return null;
    }

    // Check if this is a test token for development
    if (token === "test-token" && process.env.NODE_ENV === "development") {
      console.log("Using development test token");
      return "test-user-id";
    }

    if (!adminAuth) {
      console.log(
        "Firebase Admin Auth not initialized - falling back to test mode"
      );
      return "test-user-id";
    }

    try {
      // Verify the Firebase ID token
      const decodedToken = await adminAuth.verifyIdToken(token);
      console.log("Token verified for user:", decodedToken.uid);
      return decodedToken.uid;
    } catch (verifyError) {
      console.error("Firebase token verification failed:", verifyError);

      // In development, allow fallback
      if (process.env.NODE_ENV === "development") {
        console.log("Development mode: allowing fallback user");
        return "test-user-id";
      }

      return null;
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// Helper function to get user ID from token
export async function getUserIdFromToken(
  req: NextRequest
): Promise<string | null> {
  return verifyToken(req);
}

// Helper function to extract token from request
export function extractTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split("Bearer ")[1] || null;
}

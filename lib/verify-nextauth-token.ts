import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function verifyNextAuthToken(
  req: NextRequest
): Promise<string | null> {
  try {
    console.log("Verifying NextAuth token...");

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("NextAuth token:", token ? "Present" : "Missing");

    if (!token || !token.sub) {
      console.log("No valid NextAuth token found");
      return null;
    }

    console.log("User ID from NextAuth token:", token.sub);
    return token.sub;
  } catch (error) {
    console.error("NextAuth token verification failed:", error);
    return null;
  }
}

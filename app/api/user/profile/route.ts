import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/verify-token";
import { getUserById, updateUser, isEmailTaken } from "@/lib/firestore";

export async function GET(req: NextRequest) {
  try {
    const userId = await verifyToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return only the necessary fields
    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await verifyToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email } = body;

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const emailTaken = await isEmailTaken(email, userId);

    if (emailTaken) {
      return NextResponse.json(
        { error: "Email is already taken" },
        { status: 400 }
      );
    }

    const updatedUser = await updateUser(userId, { name, email });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    // Return only the necessary fields
    const userProfile = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      image: updatedUser.image,
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

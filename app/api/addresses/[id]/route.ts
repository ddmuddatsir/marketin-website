import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/verify-token";

// DELETE /api/addresses/[id] - Delete a specific address
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const addressId = resolvedParams.id;
    const userId = await verifyToken(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // First check if the address exists and belongs to the user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: userId,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      );
    }

    // Delete the address
    await prisma.address.delete({
      where: {
        id: addressId,
      },
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { message: "Error deleting address" },
      { status: 500 }
    );
  }
}

// GET /api/addresses/[id] - Get a specific address
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const addressId = resolvedParams.id;
    const userId = await verifyToken(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: userId,
      },
    });

    if (!address) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    return NextResponse.json(
      { message: "Error fetching address" },
      { status: 500 }
    );
  }
}

// PUT /api/addresses/[id] - Update a specific address
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const addressId = resolvedParams.id;
    const userId = await verifyToken(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { street, city, state, country, zipCode, isDefault } =
      await req.json();

    // First check if the address exists and belongs to the user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: userId,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      );
    }

    // If setting this address as default, unset other default addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Update the address
    const updatedAddress = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        street,
        city,
        state,
        country,
        zipCode,
        isDefault,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { message: "Error updating address" },
      { status: 500 }
    );
  }
}

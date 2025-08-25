import { NextResponse, NextRequest } from "next/server";
import { getAddressById, updateAddress, deleteAddress } from "@/lib/firestore";
import { verifyToken } from "@/lib/verify-token";

// GET /api/addresses/[id] - Get address by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyToken(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const address = await getAddressById(params.id);

    if (!address) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      );
    }

    // Verify the address belongs to the user
    if (address.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
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

// PUT /api/addresses/[id] - Update address
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyToken(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { street, city, state, country, zipCode, isDefault } =
      await req.json();

    if (!street || !city || !state || !country || !zipCode) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the address exists and belongs to the user
    const existingAddress = await getAddressById(params.id);
    if (!existingAddress) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      );
    }

    if (existingAddress.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updatedAddress = await updateAddress(params.id, {
      street,
      city,
      state,
      country,
      postalCode: zipCode, // Note: mapping zipCode to postalCode
      isDefault,
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

// DELETE /api/addresses/[id] - Delete address
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyToken(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify the address exists and belongs to the user
    const existingAddress = await getAddressById(params.id);
    if (!existingAddress) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      );
    }

    if (existingAddress.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await deleteAddress(params.id);

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { message: "Error deleting address" },
      { status: 500 }
    );
  }
}

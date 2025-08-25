import { NextResponse, NextRequest } from "next/server";
import { getUserAddresses, createAddress } from "@/lib/firestore";
import { verifyNextAuthToken } from "@/lib/verify-nextauth-token";

// GET /api/addresses - Get all addresses for the current user
export async function GET(req: NextRequest) {
  try {
    const userId = await verifyNextAuthToken(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const addresses = await getUserAddresses(userId);
    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { message: "Error fetching addresses" },
      { status: 500 }
    );
  }
}

// POST /api/addresses - Create a new address
export async function POST(req: NextRequest) {
  try {
    const userId = await verifyNextAuthToken(req);

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

    // If this is the first address or isDefault is true, set it as default
    const existingAddresses = await getUserAddresses(userId);
    const shouldBeDefault = isDefault || existingAddresses.length === 0;

    // Note: Firebase doesn't support transactions in the same way as Prisma
    // For now, we'll handle the default address logic in the createAddress function
    // In a production app, you might want to implement this with a Firebase transaction

    const address = await createAddress(userId, {
      street,
      city,
      state,
      country,
      postalCode: zipCode, // Note: mapping zipCode to postalCode
      isDefault: shouldBeDefault,
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { message: "Error creating address" },
      { status: 500 }
    );
  }
}

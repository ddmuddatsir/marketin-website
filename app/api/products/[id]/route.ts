import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

const DUMMY_JSON_URL = "https://dummyjson.com/products";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await axios.get(`${DUMMY_JSON_URL}/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

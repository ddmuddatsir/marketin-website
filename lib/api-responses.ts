import { NextResponse } from "next/server";

export interface ApiError {
  error: string;
  message: string;
  status: number;
  timestamp: string;
}

export function createNotFoundResponse(
  resource: string = "Resource"
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: "Not Found",
      message: `${resource} tidak ditemukan`,
      status: 404,
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  );
}

export function createBadRequestResponse(
  message: string = "Bad Request"
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: "Bad Request",
      message,
      status: 400,
      timestamp: new Date().toISOString(),
    },
    { status: 400 }
  );
}

export function createInternalServerErrorResponse(
  message: string = "Internal Server Error"
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: "Internal Server Error",
      message,
      status: 500,
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}

export function createUnauthorizedResponse(
  message: string = "Unauthorized"
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: "Unauthorized",
      message,
      status: 401,
      timestamp: new Date().toISOString(),
    },
    { status: 401 }
  );
}

export function createSuccessResponse<T>(
  data: T,
  message?: string
): NextResponse<{ data: T; message?: string; timestamp: string }> {
  return NextResponse.json(
    {
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

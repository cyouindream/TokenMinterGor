import { NextRequest, NextResponse } from "next/server";
import { CreatedToken } from "@/types/token";
import { getAllTokens, saveToken } from "@/lib/db";

// GET: Fetch all tokens
export async function GET() {
  try {
    const tokens = await getAllTokens();

    return NextResponse.json({
      success: true,
      tokens,
      count: tokens.length,
    });
  } catch (error) {
    console.error("Error reading tokens:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tokens",
        tokens: [],
      },
      { status: 500 }
    );
  }
}

// POST: Create a new token record
export async function POST(request: NextRequest) {
  try {
    const token: CreatedToken = await request.json();

    // Validate token data
    if (!token.mintAddress || !token.metadata || !token.creator) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token data",
        },
        { status: 400 }
      );
    }

    // Save token to database (will upsert if already exists)
    await saveToken(token);

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Error saving token:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save token",
      },
      { status: 500 }
    );
  }
}

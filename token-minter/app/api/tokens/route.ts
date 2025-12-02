import { NextRequest, NextResponse } from "next/server";
import { CreatedToken } from "@/types/token";
import { getAllTokens, saveToken } from "@/lib/db";

// GET: Fetch all tokens
export async function GET() {
  try {
    console.log("[api/tokens] Fetching all tokens");
    const tokens = await getAllTokens();

    console.log("[api/tokens] Tokens fetched", { count: tokens.length });
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
    console.log("[api/tokens] Incoming token save request", {
      id: token.id,
      mintAddress: token.mintAddress,
      creator: token.creator,
      txSignature: token.txSignature,
    });

    // Validate token data
    if (!token.mintAddress || !token.metadata || !token.creator) {
      console.error("[api/tokens] Invalid token payload", token);
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
    console.log("[api/tokens] Token saved", { id: token.id });

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

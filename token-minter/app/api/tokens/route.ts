import { NextRequest, NextResponse } from "next/server";
import { CreatedToken } from "@/types/token";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "tokens.json");

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data");
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read tokens from file
async function readTokens(): Promise<CreatedToken[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is empty, return empty array
    return [];
  }
}

// Write tokens to file
async function writeTokens(tokens: CreatedToken[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(tokens, null, 2));
}

// GET: Fetch all tokens
export async function GET() {
  try {
    const tokens = await readTokens();
    // Sort by creation date, newest first
    tokens.sort((a, b) => b.createdAt - a.createdAt);

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

    // Read existing tokens
    const tokens = await readTokens();

    // Check if token already exists
    const existingIndex = tokens.findIndex((t) => t.id === token.id);
    if (existingIndex >= 0) {
      // Update existing token
      tokens[existingIndex] = token;
    } else {
      // Add new token
      tokens.push(token);
    }

    // Save to file
    await writeTokens(tokens);

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

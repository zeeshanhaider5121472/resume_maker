// app/api/db/route.ts
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

// Fix: Point to the 'data' folder inside your root directory
const dbPath = path.join(process.cwd(), "data", "db.json");
const defaultDb = { resumeusers: [] };

// Read DB
export async function GET() {
  try {
    try {
      const fileData = await fs.readFile(dbPath, "utf-8");
      return NextResponse.json(JSON.parse(fileData));
    } catch (err) {
      // If file doesn't exist, create it
      await fs.writeFile(dbPath, JSON.stringify(defaultDb, null, 2), "utf-8");
      return NextResponse.json(defaultDb);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read database" },
      { status: 500 },
    );
  }
}

// Write DB
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await fs.writeFile(dbPath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to write to database" },
      { status: 500 },
    );
  }
}

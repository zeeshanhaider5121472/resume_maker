// app/api/db/route.ts
import { NextResponse } from "next/server";

// // ==========================================================
// // LOCAL DB CODE (Commented out for Vercel deployment)
// // ==========================================================
// // /*
// import fs from "fs/promises";
// import path from "path";

// // Fix: Point to the 'data' folder inside your root directory
// const dbPath = path.join(process.cwd(), "data", "db.json");
// const defaultDb = { resumeusers: [] };

// // Read DB
// export async function GET() {
//   try {
//     try {
//       const fileData = await fs.readFile(dbPath, "utf-8");
//       return NextResponse.json(JSON.parse(fileData));
//     } catch (err) {
//       // If file doesn't exist, create it
//       await fs.writeFile(dbPath, JSON.stringify(defaultDb, null, 2), "utf-8");
//       return NextResponse.json(defaultDb);
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to read database" },
//       { status: 500 },
//     );
//   }
// }

// // Write DB
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     await fs.writeFile(dbPath, JSON.stringify(body, null, 2), "utf-8");
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to write to database" },
//       { status: 500 },
//     );
//   }
// }
// */
// ==========================================================
// END LOCAL DB CODE
// ==========================================================

// ==========================================================
// REMOTE DB CODE (Active)
// ==========================================================
// const REMOTE_DB_URL =
//   "https://json-db-api-production.up.railway.app/resumeusers";
const REMOTE_DB_URL =
  "https://6a63dd2cb30b52361e1aac08.mockapi.io/resumeusers/1";

// Read DB
export async function GET() {
  try {
    const response = await fetch(REMOTE_DB_URL);

    if (!response.ok) {
      throw new Error(`Remote DB responded with status: ${response.status}`);
    }

    const resdata = await response.json();
    const data = resdata;

    // If the remote API returns a raw array, wrap it in an object
    // so the frontend still gets { resumeusers: [...] }
    if (Array.isArray(data)) {
      return NextResponse.json({ resumeusers: data });
    }

    // If it already returns an object, return it as is
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to read from remote database" },
      { status: 500 },
    );
  }
}

// Write DB
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // The frontend sends { resumeusers: [...] }.
    // We extract the array to send to the remote API.
    // const payload = body.resumeusers || body;

    const response = await fetch(REMOTE_DB_URL, {
      method: "PUT", // Note: If your Railway API requires PUT to overwrite, change this to "PUT"
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Remote DB write failed: ${errorText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to write to remote database" },
      { status: 500 },
    );
  }
}

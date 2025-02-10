import { NextResponse } from "next/server";
import Music from "@/models/Music"; // Adjust the import path based on your project structure
import dbConnect from "@/config/db"; // Ensure a proper MongoDB connection is established

export async function GET(req, { params }) {
  const { musicId } = params;

  try {
    // Connect to the database
    await dbConnect();

    // Find the music metadata by musicId
    const metadata = await Music.findOne({ musicId }).select("-_id -__v"); // Exclude `_id` and `__v` fields

    if (!metadata) {
      return NextResponse.json({ message: "Music metadata not found" }, { status: 404 });
    }

    return NextResponse.json(metadata, { status: 200 });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

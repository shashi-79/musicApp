import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
export const dynamic = "force-dynamic";
export async function GET(req, { params }) {
  const { musicId, data } = params;

  try {
    console.log(`Fetching manifest for musicId: ${musicId}, file: ${data}`);

    // Define the path to the manifest file in Supabase Storage
    const filePath = `music/${musicId}/${data}`; 
    
    const { data: fileData, error } = await supabase.storage.from('music').download(filePath);

    if (error || !fileData) {
      console.error("Error fetching file from Supabase:", error);
      return NextResponse.json(
        { message: "Manifest file not found" },
        { status: 404 }
      );
    }

    // Convert the file to a Buffer
    const fileBuffer = await fileData.arrayBuffer();

    // Return the file as a response with appropriate headers
    return new NextResponse(Buffer.from(fileBuffer), {
      headers: {
        "Content-Type": "application/dash+xml", // Update based on file type
        "Cache-Control": "public, max-age=31536000, immutable", // Optional caching settings
      },
    });
  } catch (error) {
    console.error("Error fetching manifest:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

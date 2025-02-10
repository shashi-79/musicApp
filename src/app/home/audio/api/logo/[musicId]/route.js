import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function GET(req, { params }) {
  const { musicId } = params;

  try {
    console.log("Fetching logo for musicId:", musicId);

    // Define the path to the logo in Supabase Storage
    const filePath = `logos/${musicId}.png`; 
    // Fetch the file from Supabase Storage
    const { data, error } = await supabase.storage.from('music').download(filePath);

    if (error || !data) {
      console.error("Error fetching file from Supabase:", error);
      return NextResponse.json({ message: "Logo not found" }, { status: 404 });
    }

    // Convert the file to a Buffer
    const logoBuffer = await data.arrayBuffer();

    // Return the file as a response with appropriate headers
    return new NextResponse(Buffer.from(logoBuffer), {
      headers: {
        "Content-Type": "image/png", // Set appropriate content type for PNG images
        "Cache-Control": "public, max-age=31536000, immutable", // Optional: Cache settings
      },
    });
  } catch (error) {
    console.error("Error fetching image data:", error);
    return NextResponse.json({ message: "An error occurred while fetching the image" }, { status: 500 });
  }
}

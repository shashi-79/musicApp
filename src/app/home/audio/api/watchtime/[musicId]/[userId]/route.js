import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import WatchTime from "@/models/WatchTime";

// Handle POST and GET requests
export async function POST(req, { params }) {
  const { musicId } = params;
  
  
  try {
    await dbConnect();
    
    let watchTime = await WatchTime.findOne({ musicId });

    if (!watchTime) {
      // If no record exists, create a new one
      watchTime = new WatchTime({
        musicId,
        views: 0,
        viewedBy: [],
      });
      
    } 
    // Find or create a watch time record
     watchTime.toggleWatchTime();
     
     
    return NextResponse.json({ message: "Watch time updated." }, { status: 200 });
  } catch (error) {
    console.error("Error updating watch time:", error);
    return NextResponse.json({ message: "An error occurred.", error }, { status: 500 });
  }
}

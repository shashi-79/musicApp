import dbConnect from "@/config/db";
import { NextResponse } from "next/server";
import Likes from "@/models/Likes"; // Import the Like model


export async function GET(req, { params }) {
  const { musicId } = params;

  try {
    // Connect to the database
    await dbConnect();

    // Find the music metadata by musicId
    let likes = await Likes.findOne({ musicId }).select("-_id -__v"); // Exclude `_id` and `__v` fields

    if (!likes) {
      likes = new Likes({
        musicId,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
      });
      await likes.save();
    }

    return NextResponse.json(likes, { status: 200 });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

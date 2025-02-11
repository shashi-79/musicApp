import dbConnect from "@/config/db";
import Likes from "@/models/Likes"; // Import the Like model

export async function POST(req, { params }) {
  const { musicId, userId } = params;

  await dbConnect();

  try {
    // Find the Like record for this musicId
    let like = await Likes.findOne({ musicId });

    // If no like record exists for the music, create one
    if (!like) {
      like = new Likes({
        musicId,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
      });
      await like.save();
    }

    // Toggle the like for the user
    await like.toggleLike(userId);


    return new Response(
      JSON.stringify({ message: "Like updated successfully", like }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 400 }
    );
  }
}

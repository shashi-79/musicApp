import dbConnect from "@/config/db";
import Like from "@/models/Likes"; // Import the Like model

export async function POST(req, { params }) {
  const { musicId, userId } = params;

  await dbConnect();

  try {
    // Find the Like record for this musicId
    let like = await Like.findOne({ musicId });

    if (!like) {
      like = new Like({
        musicId,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
      });
    //  await like.save();
    }

    // Toggle the dislike for the user
    await like.toggleDislike(userId);

    // After toggling, update the ranking in the Music schema
    

    return new Response(
      JSON.stringify({ message: "Dislike updated successfully", like }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 400 }
    );
  }
}

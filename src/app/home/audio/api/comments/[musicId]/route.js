import { NextResponse } from "next/server";
import Comment from '@/models/Comment';
import UserDetail from '@/models/UserDetail';
import connectDB from '@/config/db';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const dynamic = 'force-dynamic'; // Ensures fresh data
const userPicCache = {};

// Helper function to fetch image URL
const fetchImageBase64 = async (filePath) => {
  if (!filePath) return '/default-profile-pic.jpg'; // Default profile picture
  
  if (userPicCache[filePath]) {
    return userPicCache[filePath]; // Return cached value if already fetched
  }
  
  try {
    const { data, error } = await supabase.storage.from('music').download(filePath);
    if (error) {
      console.error('Error fetching image:', error);
      return '/default-profile-pic.jpg'; // Default image on error
    }

    // Convert the binary data to base64
    const arrayBuffer = await data.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const base64String = `data:image/jpeg;base64,${base64}`; // Assuming JPEG image, change as needed
    userPicCache[filePath] = base64String;
    return base64String;
  } catch (error) {
    console.error('Error fetching image:', error);
    return '/default-profile-pic.jpg'; // Default image on error
  }
};


// **GET Request (Fetch Comments)**
export async function GET(req, { params }) {
  const { musicId } = params;
  const { searchParams } = new URL(req.url);
  const lastFetched = searchParams.get('lastFetched')
  
  
  try {
    await connectDB();
    
    // Fetch only new comments if `lastFetched` is provided
    let query = { musicId };
    if (lastFetched) {
      const lastDate = new Date(lastFetched);
      if (isNaN(lastDate.getTime())) {
        return NextResponse.json({ message: 'Invalid date format' }, { status: 400 });
      }
      query.createdAt = { $gt: lastDate };
    }

    const comments = await Comment.find(query).sort({ createdAt: -1 }).lean();

    const enrichedComments = await Promise.all(
      comments.map(async (comment) => {
        const user = await UserDetail.findOne({ userId: comment.userId }).limit(100).lean();
        const userPic = await fetchImageBase64(user?.pic);
        return { ...comment, userPic };
      })
    );

    return NextResponse.json(enrichedComments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// **POST Request (Add Comment)**
export async function POST(req, { params }) {
  const { musicId } = params;

  try {
    const { userId, text } = await req.json();
    if (!userId || !text.trim()) {
      return NextResponse.json({ message: 'User ID and comment text are required' }, { status: 400 });
    }

    await connectDB();

    const newComment = new Comment({ musicId, userId, text });
    await newComment.save();

    const user = await UserDetail.findOne({ userId }).lean();
    const userPic = await fetchImageBase64(user?.pic);

    return NextResponse.json({
      message: 'Comment posted successfully',
      comment: { ...newComment.toObject(), userPic },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

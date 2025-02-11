import UserDetail from "@/models/UserDetail";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import connectDB from '@/config/db';

// Supabase configuration
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function GET(req, { params }) {
  const { userId } = params;

  try {
    await connectDB();
    const user = await UserDetail.findOne({ userId });

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Fetch images from Supabase and convert to Base64
    const fetchImageAsBase64 = async (filePath) => {
      if (!filePath) return null;
      
      const { data, error } = await supabase.storage.from('music').download(filePath);
      if (error) {
        console.error(`Error fetching image: ${error.message}`);
        return null;
      }

      const buffer = await data.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      return `data:image/png;base64,${base64}`;
    };

    const profilePic = await fetchImageAsBase64(user.pic);
    const bannerImage = await fetchImageAsBase64(user.banner);

    return NextResponse.json({ 
      user: { 
        ...user.toObject(), 
        pic: profilePic, 
        banner: bannerImage 
      } 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error.' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { userId } = params;

  try {
    await connectDB();

    // Parse form data
    const form = await req.formData();
    const name = form.get('name');
    const contact = form.get('contact');
    const about = form.get('about');
    const pic = form.get('pic'); // Profile picture
    const banner = form.get('banner'); // Banner image

    if (!name || !contact) {
      return NextResponse.json({ message: 'Name and Contact are required.' }, { status: 400 });
    }

    let user = await UserDetail.findOne({ userId });

    if (!user) {
      user = new UserDetail({ userId, name, contact, about });
    } else {
      user.name = name;
      user.contact = contact;
      user.about = about;
    }

    // Function to upload image and store only the file path
    const uploadToSupabase = async (file, path) => {
      const { error } = await supabase.storage
        .from('music') // Correct storage bucket name
        .upload(path, file, { upsert: true });

      if (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      return path; // Store only file path
    };

    // Upload Profile Picture
    if (pic) {
      const fileBuffer = Buffer.from(await pic.arrayBuffer());
      const filePath = `profile_pics/${userId}.png`;
      user.pic = await uploadToSupabase(fileBuffer, filePath);
    }

    // Upload Banner Image
    if (banner) {
      const fileBuffer = Buffer.from(await banner.arrayBuffer());
      const filePath = `banners/${userId}.png`;
      user.banner = await uploadToSupabase(fileBuffer, filePath);
    }

    await user.save();

    return NextResponse.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error.' }, { status: 500 });
  }
}

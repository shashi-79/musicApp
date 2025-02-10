import fs from "fs";
import path from "path";
import { encryptAndGenerateManifest } from "@/utils/encryptor";
import { v4 as uuidv4 } from "uuid";
import Music from "@/models/Music";
import connectDB from "@/config/db";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

 const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectDB();

    const form = await req.formData();
    const name = form.get("name");
    const description = form.get("description");
    const languages = form.get("languages");
    const userId = req.headers.get("userid");
    const musicFile = form.get("music");
    const logoFile = form.get("logo");

    if (!name || !description || !languages || !userId || !musicFile || !logoFile) {
      return new Response(JSON.stringify({ message: "All fields are required!" }), { status: 400 });
    }

    const musicId = uuidv4();
    const musicDir = path.join(process.cwd(), "uploads", "music", musicId);
    const logoDir = path.join(process.cwd(), "uploads", "logos");

    fs.mkdirSync(musicDir, { recursive: true });
    fs.mkdirSync(logoDir, { recursive: true });

    // Save music and logo files
    const musicPath = path.join(musicDir, musicFile.name);
    const logoPath = path.join(logoDir, `${musicId}.png`);
    fs.writeFileSync(musicPath, Buffer.from(await musicFile.arrayBuffer()));
    fs.writeFileSync(logoPath, Buffer.from(await logoFile.arrayBuffer()));

    // Encrypt music and generate manifest
    const manifestPath = await encryptAndGenerateManifest(musicPath, musicDir, musicId);

    fs.unlinkSync(musicPath);
    // Upload files to Supabase Storage
    const uploadToSupabase = async (filePath, storagePath) => {
      const fileBuffer = fs.readFileSync(filePath);
      const { error } = await supabase.storage
        .from("music") // Replace with your bucket name
        .upload(storagePath, fileBuffer);

      if (error) throw error;
    };

    // Upload manifest and logo
 //   await uploadToSupabase(manifestPath, `manifests/${musicId}/manifest.mpd`);
    await uploadToSupabase(logoPath, `logos/${musicId}.png`);

    // Upload encrypted chunks
    const chunkFiles = fs.readdirSync(musicDir);
    for (const file of chunkFiles) {
      const filePath = path.join(musicDir, file);
      
      if (fs.statSync(filePath).isFile()) {
        await uploadToSupabase(filePath, `music/${musicId}/${file}`);
      }
    }

    // Save metadata in the database
    await Music.create({
      musicId,
      userId,
      name,
      description,
      languages: languages.split(",").map((lang) => lang.trim()),
      logoPath: `/home/audio/api/logo/${musicId}`,
      manifestPath: `/home/audio/api/manifest/${musicId}`,
    });

    // Cleanup local files
    fs.rmdirSync(musicDir, { recursive: true });
    fs.unlinkSync(logoPath);

    return new Response(JSON.stringify({ message: "Uploaded successfully!", musicId }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}

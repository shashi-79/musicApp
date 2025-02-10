import dbConnect from "@/config/db";
import { NextResponse } from "next/server";


export async function POST(req) {
  

  await dbConnect();

  try {

    return new Response(
      JSON.stringify({ message: "Dislike updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 400 }
    );
  }
}

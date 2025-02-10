import Music from "@/models/Music";
import connectDB from '@/config/db';

export async function GET(req) {
  await connectDB();
  
  const { searchParams } = new URL(req.url);
  let page = parseInt(searchParams.get("page") || "1", 10);
  let limit = parseInt(searchParams.get("limit") || "10", 10);

  if (isNaN(page) || page <= 0) {
    return new Response(
      JSON.stringify({ error: "Invalid page number. Page must be a positive integer." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (isNaN(limit) || limit <= 0) {
    return new Response(
      JSON.stringify({ error: "Invalid limit. Limit must be a positive integer." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const suggestions = await Music.getSuggestions(page, limit);

    if (!suggestions || suggestions.length === 0) {
      return new Response(JSON.stringify({ message: "No music suggestions found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    
    console.log(suggestions)

    return new Response(
      JSON.stringify({
        success: true,
        page,
        limit,
        total: suggestions.length,
        data: suggestions,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch suggestions. Please try again later.",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

import Music from "@/models/Music";
import connectDB from '@/config/db';

const getPaginationMetadata = (totalCount, page, limit) => ({
  total: totalCount,
  page: parseInt(page),
  limit: parseInt(limit),
  totalPages: Math.ceil(totalCount / limit),
});

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const language = searchParams.get("language") || null;
    const sortBy = searchParams.get("sortBy") || "name";
    const order = searchParams.get("order") || "asc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const searchCriteria = {};
    if (query) {
      searchCriteria.$or = [
        { name: new RegExp(query, "i") },
        { description: new RegExp(query, "i") },
      ];
    }
    if (language) {
      searchCriteria.languages = language;
    }

    const sortOrder = order === "desc" ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };
    const skip = (page - 1) * limit;

    const results = await Music.find(searchCriteria)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalCount = await Music.countDocuments(searchCriteria);
    const pagination = getPaginationMetadata(totalCount, page, limit);

    return new Response(
      JSON.stringify({
        success: true,
        data: results,
        pagination,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error during search:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

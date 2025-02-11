import Views from '@/models/Views'; // Adjust the import path as needed
import connectToDatabase from '@/config/db'; // Ensure database connection

export async function POST(req, { params }) {
  const { musicId, userId } = params ;

  if (!musicId || !userId) {
    return new Response(JSON.stringify({ message: "Music ID and User ID are required." }), { 
      status: 400 
    });
  }
  
  

  try {
    // Ensure database connection
    await connectToDatabase();

    // Find or create a view record for the music
    let view = await Views.findOne({ musicId });

    if (!view) {
      // If no record exists, create a new one
      view = new Views({
        musicId,
        views: 0,
        viewedBy: [],
      });
      
    } 
     

      await view.toggleView( userId);
      

    return new Response(JSON.stringify({ message: "View recorded successfully." }), { 
      status: 200 
    });
  } catch (error) {
    console.error("Error handling music view:", error);
    return new Response(JSON.stringify({ message: "An error occurred.", error }), { 
      status: 500 
    });
  }
}

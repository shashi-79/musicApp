'use client'
import { FaGlobe, FaEye, FaThumbsUp, FaThumbsDown, FaCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";

const Likes =  ({musicId ,userId }:{musicId:any , userId:any})=>{
  
 
   const [likeCount, setLikesCount] = useState(0);
   const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    
    useEffect(() => {
      fetchLikes();
    },[])
    
      const fetchLikes = async()=>{  
        try {
            
            const response = await axios.get(`/home/audio/api/like/${musicId}`);

            if (response.status === 200) {
                const {
                    likes,
                    dislikes,
                    likedBy,
                    dislikedBy,
                } = response.data;
                
                setLikesCount(likes);
                
                setLiked(likedBy.includes(userId));
                setDisliked(dislikedBy.includes(userId));
            } else {
                throw new Error("Failed to fetch likes");
            }
        } catch (error: any) {
            
            console.error("Error fetching likes:", error);
        } 
    };

    const handleLike = async () => {
        try {
            await axios.post(`/home/audio/api/like/${musicId}/${userId}`);
            setLiked(true);
            setDisliked(false);
          //  fetchLikes(); // Refresh metadata after liking
        } catch (error) {
            console.error("Error liking audio:", error);
        }
    };

    const handleDislike = async () => {
        try {
            await axios.post(`/home/audio/api/dislike/${musicId}/${userId}`);
            setLiked(false);
            setDisliked(true);
         //   fetchLikes(); // Refresh metadata after disliking
        } catch (error) {
            console.error("Error disliking audio:", error);
        }
    };
 
 return(<div className="w-20 rounded bg-gray-100 flex items-center space-x-4 p-2">
  {/* Like Button */}
  <div className="flex items-center text-gray-700">
    <FaThumbsUp
      className={`mr-1 cursor-pointer ${liked ? "text-blue-500" : "text-gray-500"}`}
      onClick={handleLike}
    />
    <span>{likeCount}</span>
  </div>

  {/* Dislike Button */}
  <div className="flex items-center text-gray-700">
    <FaThumbsDown
      className={`cursor-pointer ${disliked ? "text-red-500" : "text-gray-500"}`}
      onClick={handleDislike}
    />
  </div>
</div>
)
}

export default Likes;
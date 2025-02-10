'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AudioPlaybackEME from "./AudioPlaybackEME";
import CommentSection from "./CommentSection";
import Description from "./Description";
import Likes from "./Likes";
import axios from "axios";
import { FaGlobe, FaEye, FaThumbsUp, FaThumbsDown, FaCalendarAlt } from "react-icons/fa";

const AudioPlayerPage = () => {
    const [audioMetadata, setAudioMetadata] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    const { musicId } = useParams(); // Retrieve musicId from the URL
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (musicId) fetchAudioMetadata();

    }, [musicId]);

    const fetchAudioMetadata = async () => {
        try {
            setIsLoading(true);
            setError(null); // Reset error state
            const response = await axios.get(`/home/audio/api/metadata/${musicId}`);

            if (response.status === 200) {
                const {
                    musicId: id,
                    userId,
                    name,
                    description,
                    languages,
                    logoPath,
                    manifestPath,
                    createdAt,
                    views,
                } = response.data;

                const newMetadata = {
                    musicId: id,
                    userId,
                    name,
                    description,
                    languages,
                    logoPath,
                    createdAt,
                    manifestPath
                };
                
                
                // Update state only if the metadata has changed
                if (JSON.stringify(audioMetadata) !== JSON.stringify(newMetadata)) {
                    setAudioMetadata(newMetadata);
                }

                
            } else {
                throw new Error("Failed to fetch metadata");
            }
        } catch (error: any) {
            setError("There was an error fetching the audio metadata.");
            console.error("Error fetching metadata:", error);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen">
            {isLoading ? (
                <div className="text-center text-gray-700 text-lg font-medium animate-pulse">
                    Loading...
                </div>
            ) : error ? (
                <div className="text-center text-red-600 text-lg font-medium">{error}</div>
            ) : (
                <div className="p-8 bg-white shadow-xl w-full max-w-full rounded-lg">
                    {audioMetadata ? (
                        <div>
                          <div className="grid place-items-center w-full">
                            <img
                                src={audioMetadata.logoPath || "/1.webp"} // Provide a fallback logo
                                alt={audioMetadata.name}
                                className=" w-72 h-72 object-cover rounded-md shadow-md"
                            />
                          </div>
                            
                            
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center text-gray-700">
                                    <FaGlobe className="mr-2 text-gray-500" />
                                    <span>{audioMetadata.languages?.join(", ") || "N/A"}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <FaEye className="mr-2 text-gray-500" />
                                    <span>{audioMetadata.views}</span>
                                </div>
                                <Likes musicId={musicId} userId={userId}/>
                                <div className="flex items-center text-gray-700">
                                    <FaCalendarAlt className="mr-2 text-gray-500" />
                                    <span>{new Date(audioMetadata.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="mt-6">
                                <AudioPlaybackEME manifestUrl={`${audioMetadata.manifestPath}/manifest.mpd`} musicId={musicId}
                                />
                            </div>
                            <h1 className="text-3xl font-bold mt-6 text-gray-800 capitalize">
                                {audioMetadata.name}
                            </h1>

                            <Description data={audioMetadata.description}/>
                            
                            <CommentSection musicId={musicId}/>
                        </div>
                    ) : (
                        <p className="text-center text-gray-600 font-medium italic">No metadata available for this audio.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AudioPlayerPage;

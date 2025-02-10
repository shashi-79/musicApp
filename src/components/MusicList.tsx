import { FaShareAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface MusicData {
    musicId: string;
    name: string;
    logoPath: string;
    views: number;
    likes: number;
    languages: string[];
}

interface MusicProps {
    musicData: MusicData[]; // Expecting an array of MusicData
}

const MusicList: React.FC<MusicProps> = ({ musicData }) => {
    return (
        <div className="w-full container px-4 py-8">
            {musicData.length > 0 ? (
                <div className="w-full grid justify-center items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    {musicData.map((music) => (
                        <MusicCard key={music.musicId} music={music} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-lg text-gray-500">No music found.</p>
            )}
        </div>
    );
};

interface MusicCardProps {
    music: MusicData;
}

const MusicCard: React.FC<MusicCardProps> = ({ music }) => {
    const router = useRouter();

    const handleClick = (musicId: string) => {
        router.push(`/home/audio/${musicId}`);
    };

    const handleShare = (musicId: string) => {
        const shareData = {
            title: "Check out this music!",
            text: "I found this amazing music. Take a listen!",
            url: `https://musicapp-5wv9.onrender.com/music/${musicId}`,
        };
        if (navigator.share) {
            navigator
                .share(shareData)
                .then(() => {
                    console.log("Music shared successfully");
                })
                .catch((error) => {
                    console.log("Error sharing music:", error);
                });
        } else {
            alert("Share functionality is not supported in your browser.");
        }
    };

    return (
        <div
            onClick={() => handleClick(music.musicId)}
            className="relative max-w-64 min-w-52 m-auto h-80 group bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer transform sm:m-0"
            style={{
                backgroundImage: `url(${music.logoPath})`, // Background image for the music card
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            aria-label={`Cover image for ${music.name}`} // Added aria-label for accessibility
        >
            <div className="p-4 flex flex-col items-center bg-opacity-90 rounded-lg w-full">


                {/* Music Details with alt text for accessibility */}
                <h2 className="text-lg absolute bottom-8 text-black rounded-2xl px-2 bg-white bg-opacity-20 [text-shadow:_0px_0px_3px_rgb(255_255_255)] dark:[text-shadow:_0px_0px_3px_rgb(0_0_0)] dark:text-white dark:shadow-stone-950 mb-2 truncate" aria-label={`Music title: ${music.name}`}>{music.name}</h2>


                {/* Views and Likes */}
                <div className="flex justify-between w-full text-gray-600 text-sm mb-3">
                    <span className="text-sm">

                        <strong>{music.views}</strong>
                    </span>
                </div>

                {/* Share Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); 
                        handleShare(music.musicId);
                    }}
                    className="flex absolute top-2 right-1.5 items-center justify-center text-white text-xl rounded-full transition-all duration-300 hover:bg-gray-200"
                >
                    <FaShareAlt className="mr-2" />
                </button>
            </div>
        </div>
    );
};

export default MusicList;

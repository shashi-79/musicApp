import { useState, useEffect, useRef } from 'react';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';

// Define TypeScript interfaces
interface Comment {
  _id: string;
  userId: string;
  userPic: string;
  text: string;
  createdAt: string;
}

interface CommentSectionProps {
  musicId: string|string[];
}

export default function CommentSection({ musicId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || '');
  const [text, setText] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const lastFetchedRef = useRef<string | null>(null); // Store lastFetched as a ref (prevents re-renders)
  const fetchingRef = useRef<boolean>(false); // Prevent concurrent fetches

  // Fetch comments with filtering to avoid duplication
  const fetchComments = async () => {
    if (!musicId || show || fetchingRef.current) return;

    fetchingRef.current = true;
    const url = lastFetchedRef.current
      ? `/home/audio/api/comments/${musicId}?lastFetched=${lastFetchedRef.current}`
      : `/home/audio/api/comments/${musicId}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch comments');

      const data: Comment[] = await response.json();
      if (data.length > 0) {
        // Filter out duplicates before updating state
        setComments((prev:any) => {
          const newComments = data.filter(
            (newComment:any) => !prev.some((existing:any) => existing._id === newComment._id)
          );
          return [...newComments, ...prev]; // Keep newest on top
        });

        lastFetchedRef.current = data[0].createdAt; // Update lastFetched properly
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, 10000);
    return () => clearInterval(interval);
  }, [musicId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !text.trim()) return alert('User ID and comment text are required');

    setLoading(true);
    try {
      const response = await fetch(`/home/audio/api/comments/${musicId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, text }),
      });

      if (response.ok) {
        const newComment: { comment: Comment } = await response.json();
        setComments((prev:any) => [newComment.comment, ...prev]); // Add new comment to the top
        setText('');
        lastFetchedRef.current = newComment.comment.createdAt; // Update lastFetched
      } else {
        alert('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-w-full w-fit mx-auto p-2 bg-gray-100 rounded-lg">
      {/* Header with Toggle */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg ml-2 font-bold">Comments</h2>
        <button onClick={() => setShow((prev) => !prev)} className="text-gray-700 text-xl">
          {show ? <FaMinusCircle /> : <FaPlusCircle />}
        </button>
      </div>

      {/* Comment Section */}
      {show && (
        <div>
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-white p-3 rounded shadow">
                {/* User Info */}
                <div className="flex items-center space-x-3 bg-gray-100 p-2 rounded">
                  <img src={comment.userPic} alt="User Profile" className="w-10 h-10 rounded-full" />
                  <p className="text-sm text-gray-700">{comment.userId}</p>
                </div>

                {/* Comment Text */}
                <p className="text-gray-800 break-all mt-2">{comment.text}</p>

                {/* Timestamp */}
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmit} className="mt-4">
            <textarea
              placeholder="Write a comment..."
              className="border p-2 w-full rounded mb-2"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

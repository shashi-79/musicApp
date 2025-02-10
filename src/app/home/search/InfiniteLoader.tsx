import { useEffect, useRef } from 'react';

// Define the props interface for the component with explicit types
interface InfiniteLoaderProps {
  onLoadMore: () => void;  // This is the function type for onLoadMore
  hasMore: boolean;        // Boolean indicating if there are more items to load
  loading: boolean;        // Boolean indicating if it's currently loading
}

const InfiniteLoader: React.FC<InfiniteLoaderProps> = ({ onLoadMore, hasMore, loading }) => {
  // Create a ref for the loader div element, ensuring it's typed properly
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Early return if there are no more items or it's already loading
    if (!hasMore || loading) return;

    // IntersectionObserver logic to trigger onLoadMore when the loader element is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { root: null, threshold: 1.0 }
    );

    // Ensure the element is available before starting the observation
    const loaderElement = loaderRef.current;
    if (loaderElement) {
      observer.observe(loaderElement);
    }

    // Cleanup observer when the component unmounts or ref changes
    return () => {
      if (loaderElement) {
        observer.unobserve(loaderElement);
      }
    };
  }, [onLoadMore, hasMore, loading]);

  return (
    <div ref={loaderRef} className="text-center py-4">
      {loading ? (
        <p className="text-gray-600">Loading more...</p> // Optionally, add a spinner here
      ) : hasMore ? (
        <p className="text-gray-500">Scroll to load more...</p>
      ) : (
        <p className="text-gray-400">End of available content </p>
      )}
    </div>
  );
};

export default InfiniteLoader;

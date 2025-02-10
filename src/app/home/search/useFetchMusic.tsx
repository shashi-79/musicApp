import { useState, useEffect, useCallback } from 'react';

interface Pagination {
  total: number;
  totalPages: number;
}

interface MusicData {
  // Define the structure of the music data returned from the API
  id: number;
  title: string;
  artist: string;
  genre: string;
  // Add other relevant fields here based on your data
}

interface UseFetchMusicParams {
  query: string;
  language: string;
  page: number;
  limit: number;
}

const useFetchMusic = ({ query, language, page, limit }: UseFetchMusicParams) => {
  const [musicData, setMusicData] = useState<MusicData[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, totalPages: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null | any>(null);

  // Debounced query state
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

  // Debounce the query input to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 1000); // Debounce delay time (500ms)

    return () => {
      clearTimeout(handler); // Cleanup timeout on query change
    };
  }, [query]);

  // Function to handle API calls
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log(page)
    if(page==0){
      setMusicData([]);
      setPagination({ total: 0, totalPages: 0 })
      return;
    }
    try {
      const response = await fetch(
        `/home/search/api/?query=${debouncedQuery}&language=${language}&page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();

      // Append data if it's not the first page
      setMusicData((prevData) => (page === 1 ? data.data : [...prevData, ...data.data]));
      setPagination(data.pagination);
    } catch (err: unknown) {
      // Type-checking the error
      if (err instanceof Error) {
        setError(err.message || 'Error fetching music data.');
      } else {
        setError('Error fetching music data.');
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, language, page, limit]);

  // Effect to fetch data when any dependency changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { musicData, pagination, loading, error };
};

export default useFetchMusic;

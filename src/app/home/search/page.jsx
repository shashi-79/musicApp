"use client";
import { useState, useEffect } from 'react';
import SearchBox from './SearchBox';
import MusicList from '@/components/MusicList'; // Assuming this is the correct path
import InfiniteLoader from './InfiniteLoader';
import useFetchMusic from './useFetchMusic';
const Home = () => {

  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [page, setPage] = useState(0);
  const [limit] = useState(10); // Fixed limit for each page
  
  // Fetch music data
  const { musicData, pagination, loading, error } = useFetchMusic({
    query,
    language,
    page,
    limit,
  });

  // Reset page to 1 when query or language changes
  useEffect(() => {
    if(query!=""){
    setPage(1);
    }else{
    setPage(0);
      
    }
  }, [query, language]);

  const loadMore = () => {
    if (page < pagination.totalPages && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Search Box with reset logic */}
      <SearchBox 
        query={query} 
        setQuery={setQuery} 
        language={language} 
        setLanguage={setLanguage} 
        onSearch={() => setPage(1)} 
      />
      
      {/* Error handling */}
      {error && <p className="text-center text-lg text-red-600">{error}</p>}
      
      {/* Music list display */}
      <MusicList musicData={musicData} />
      
      {/* Infinite Scroll Loader */}
      <InfiniteLoader 
        onLoadMore={loadMore} 
        hasMore={page < pagination.totalPages} 
        loading={loading} 
      />
    </div>
  );
};

export default Home;

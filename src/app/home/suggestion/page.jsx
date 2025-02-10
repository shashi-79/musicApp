'use client';

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MusicList from "@/components/MusicList";

const Home = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Static limit
  const [hasMore, setHasMore] = useState(true);
  const isFetching = useRef(false); // To prevent duplicate fetches
  const observer = useRef(null);

  useEffect(() => {
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchSuggestions = async () => {
    if (isFetching.current) return; // Prevent double fetch
    isFetching.current = true;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/home/suggestion/api", {
        params: { page, limit },
      });

      const newSuggestions = response.data.data || [];
      setSuggestions((prev) => [...prev, ...newSuggestions]);
      setHasMore(newSuggestions.length >= limit);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch suggestions");
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const lastItemRef = (node) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetching.current) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

  return (
    <div className="container justify-center my-1 font-sans">
    
        <MusicList musicData={suggestions} />
    

      {loading && (
        <div className="text-center text-gray-500 mt-6">Loading more...</div>
      )}

      {error && (
        <div className="text-center text-red-500 mt-6">{error}</div>
      )}

      {!hasMore && !loading && (
        <p className="text-center text-gray-500 mt-6 italic">
          End of available music.
        </p>
      )}

      {/* Last item ref */}
      <div ref={lastItemRef}></div>
    </div>
  );
};

export default Home;
